import json
import re
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
WORKBOOK = (
    Path.home()
    / "Downloads"
    / "SAFFIRE"
    / "SAFFIRE-1_MergeResult-jpeg_Update_Final_v2.xlsx"
)
IMAGE_DIR = ROOT / "public" / "data" / "saffire" / "f1c1"
MANIFEST = IMAGE_DIR / "manifest.json"
OUTPUT = IMAGE_DIR / "integrity-report.json"


def clean(value):
    return str(value).strip() if value is not None else ""


def truthy_flag(value):
    if value is None:
        return False
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    return clean(value).lower() in {
        "yes", "true", "1", "y", "corrupt", "corrupted"
    }


def filename_from(value):
    text = clean(value)
    if not text:
        return ""
    match = re.search(r"F1C1-[^\\/:*?\"<>|\s]+\.jpe?g", text, re.I)
    return match.group(0) if match else ""


def load_manifest():
    if not MANIFEST.exists():
        raise FileNotFoundError(f"Manifest not found: {MANIFEST}")

    data = json.loads(MANIFEST.read_text(encoding="utf-8-sig"))
    if not isinstance(data, list):
        raise ValueError("Manifest must contain a JSON array.")

    names = []
    for row in data:
        if isinstance(row, dict) and row.get("filename"):
            names.append(clean(row["filename"]))
    return names


def main():
    if not WORKBOOK.exists():
        raise FileNotFoundError(f"Workbook not found: {WORKBOOK}")
    if not IMAGE_DIR.exists():
        raise FileNotFoundError(f"Image directory not found: {IMAGE_DIR}")

    manifest_names = load_manifest()
    actual_paths = {
        p.name: p for p in IMAGE_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg"}
    }
    actual_names = set(actual_paths)
    manifest_set = set(manifest_names)

    workbook = openpyxl.load_workbook(
        WORKBOOK, read_only=True, data_only=True
    )

    sheet_name = "PreFlowVis - TimeSort"
    if sheet_name not in workbook.sheetnames:
        raise ValueError(f"Missing worksheet: {sheet_name}")

    sheet = workbook[sheet_name]
    rows = sheet.iter_rows(values_only=True)
    headers = [clean(v) for v in next(rows)]
    col = {name: i for i, name in enumerate(headers)}

    required = [
        "Jpeg File Name",
        "Jpeg File size (bytes)",
        "Pre FV Rec'd Corrupt",
    ]
    missing_headers = [h for h in required if h not in col]
    if missing_headers:
        raise ValueError(f"Missing workbook columns: {missing_headers}")

    expected_sizes = {}
    inventory_corrupt_flags = set()
    inventory_names = set()
    duplicate_inventory = Counter()
    inventory_records = 0

    for row in rows:
        filename = filename_from(row[col["Jpeg File Name"]])
        if not filename:
            continue

        inventory_records += 1
        duplicate_inventory[filename] += 1
        inventory_names.add(filename)

        size_value = row[col["Jpeg File size (bytes)"]]
        try:
            expected_sizes[filename] = int(size_value)
        except (TypeError, ValueError):
            pass

        if truthy_flag(row[col["Pre FV Rec'd Corrupt"]]):
            inventory_corrupt_flags.add(filename)

    # Read the separate received-corrupted sheet, if its F1 column exists.
    separate_corrupt_names = set()
    corrupt_sheet_name = "Received - jpeg Corrupted"
    if corrupt_sheet_name in workbook.sheetnames:
        corrupt_sheet = workbook[corrupt_sheet_name]
        corrupt_rows = corrupt_sheet.iter_rows(values_only=True)
        corrupt_headers = [clean(v) for v in next(corrupt_rows)]
        f1_columns = [
            i for i, h in enumerate(corrupt_headers)
            if "f1" in h.lower() and "corrupt" in h.lower()
        ]

        for row in corrupt_rows:
            for i in f1_columns:
                filename = filename_from(row[i])
                if filename:
                    separate_corrupt_names.add(filename)

    # Restrict workbook inventory to the actual F1C1 camera sequence.
    expected_names = {
        name for name in inventory_names
        if name.upper().startswith("F1C1-")
    }
    inventory_corrupt = {
        name for name in inventory_corrupt_flags
        if name.upper().startswith("F1C1-")
    }
    separate_corrupt = {
        name for name in separate_corrupt_names
        if name.upper().startswith("F1C1-")
    }

    # Validate the JPEG file signature and end marker without extra packages.
    unreadable = []
    for name, path in actual_paths.items():
        if not name.upper().startswith("F1C1-"):
            continue
        try:
            with path.open("rb") as f:
                start = f.read(2)
                f.seek(max(0, path.stat().st_size - 2))
                end = f.read(2)
            if start != b"\xff\xd8" or end != b"\xff\xd9":
                unreadable.append(name)
        except OSError:
            unreadable.append(name)

    actual_f1c1 = {
        name for name in actual_names
        if name.upper().startswith("F1C1-")
    }
    manifest_f1c1 = {
        name for name in manifest_set
        if name.upper().startswith("F1C1-")
    }

    missing_from_disk = sorted(expected_names - actual_f1c1)
    unexpected_on_disk = sorted(actual_f1c1 - expected_names)

    size_mismatches = []
    for name in sorted(actual_f1c1 & expected_names):
        expected = expected_sizes.get(name)
        if expected is None:
            continue
        actual = actual_paths[name].stat().st_size
        if actual != expected:
            size_mismatches.append({
                "filename": name,
                "inventory_bytes": expected,
                "local_bytes": actual,
            })

    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "scope": "SAFFIRE-I PreFlowVis F1C1 local JPEG sequence",
        "workbook": WORKBOOK.name,
        "inventory_sheet": sheet_name,
        "local_directory": str(IMAGE_DIR),
        "summary": {
            "manifest_records": len(manifest_names),
            "manifest_unique_filenames": len(manifest_set),
            "local_jpeg_files_all_cameras": len(actual_names),
            "local_f1c1_files": len(actual_f1c1),
            "inventory_f1c1_unique_files": len(expected_names),
            "inventory_f1c1_records_scanned": inventory_records,
            "manifest_entries_missing_on_disk": len(
                manifest_f1c1 - actual_f1c1
            ),
            "disk_f1c1_files_missing_from_manifest": len(
                actual_f1c1 - manifest_f1c1
            ),
            "inventory_f1c1_missing_on_disk": len(missing_from_disk),
            "disk_f1c1_not_listed_in_inventory": len(unexpected_on_disk),
            "local_jpeg_signature_or_end_marker_flags": len(unreadable),
            "inventory_size_mismatches": len(size_mismatches),
            "inventory_marked_corrupt": len(inventory_corrupt),
            "separately_listed_as_corrupt": len(separate_corrupt),
            "duplicate_inventory_filenames": sum(
                1 for n, count in duplicate_inventory.items()
                if n.upper().startswith("F1C1-") and count > 1
            ),
        },
        "details": {
            "inventory_missing_on_disk": missing_from_disk,
            "disk_files_not_in_inventory": unexpected_on_disk,
            "manifest_entries_missing_on_disk": sorted(
                manifest_f1c1 - actual_f1c1
            ),
            "disk_files_missing_from_manifest": sorted(
                actual_f1c1 - manifest_f1c1
            ),
            "jpeg_signature_or_end_marker_flags": sorted(unreadable),
            "size_mismatches": size_mismatches,
            "inventory_marked_corrupt": sorted(inventory_corrupt),
            "separately_listed_as_corrupt": sorted(separate_corrupt),
            "duplicate_inventory_filenames": sorted(
                n for n, count in duplicate_inventory.items()
                if n.upper().startswith("F1C1-") and count > 1
            ),
        },
        "limitations": [
            "JPEG signature and end-marker checks are not full image decoding.",
            "Inventory flags describe the workbook, not independently verified image damage.",
            "A file absent from the workbook is flagged for review, not automatically considered invalid.",
            "The audit does not establish scientific validity of image content.",
        ],
    }

    OUTPUT.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8"
    )

    print("\n=== SideroSpace SAFFIRE INTEGRITY AUDIT ===")
    for key, value in report["summary"].items():
        print(f"{key}: {value}")
    print(f"\nDetailed report saved to:\n{OUTPUT}")

    workbook.close()


if __name__ == "__main__":
    main()
