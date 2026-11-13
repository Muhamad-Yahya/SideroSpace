
from pathlib import Path
import json

workbook = (
    Path.home()
    / "Downloads"
    / "SAFFIRE"
    / "SAFFIRE-1_MergeResult-jpeg_Update_Final_v2.xlsx"
)

try:
    import openpyxl
except ImportError:
    print("Missing dependency. Run: py -m pip install openpyxl")
    raise SystemExit(1)

if not workbook.exists():
    print(f"Workbook not found: {workbook}")
    raise SystemExit(1)

print(f"Workbook: {workbook.name}")
print(f"Size: {workbook.stat().st_size / (1024 * 1024):.2f} MB")

# Read-only mode protects the original workbook.
wb = openpyxl.load_workbook(
    workbook,
    read_only=True,
    data_only=False,
)

print("\nWORKSHEETS")
print("=" * 70)

for ws in wb.worksheets:
    print(f"\nSheet: {ws.title}")
    print(f"Dimensions: {ws.max_row} rows x {ws.max_column} columns")

    # Inspect a small sample, not the entire workbook.
    for row in ws.iter_rows(min_row=1, max_row=min(ws.max_row, 6),
                            values_only=True):
        values = [
            str(value)[:100] if value is not None else None
            for value in row[:12]
        ]
        print(json.dumps(values, ensure_ascii=False))

print("\nEXTERNAL LINKS")
print("=" * 70)

try:
    print("External links:", len(wb._external_links))
except Exception:
    print("Could not determine external link count.")

wb.close()
print("\nInspection complete. Original workbook unchanged.")
