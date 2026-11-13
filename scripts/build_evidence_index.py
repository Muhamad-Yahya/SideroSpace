
import json
import re
import zipfile
from pathlib import Path
from datetime import datetime, timezone

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DOWNLOADS = Path.home() / "Downloads"
OUTPUT = ROOT / "public" / "data" / "research" / "evidence-index.json"

SEARCH_ROOTS = [
    ROOT / "public" / "data" / "research",
    DOWNLOADS / "SAFFIRE",
    DOWNLOADS / "FLEX",
    DOWNLOADS / "BASS",
]

TEXT_EXTENSIONS = {".txt", ".md"}
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 180


def infer_experiment(text):
    value = text.lower()

    if "bass-ii" in value or "bass_ii" in value or "psi-25" in value:
        return "BASS-II"
    if "saffire" in value or "psi-98" in value or "psi-166" in value:
        return "SAFFIRE-I"
    if "flex" in value or "psi-69" in value:
        return "FLEX"

    return "Unclassified"


def clean_text(text):
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_chunks(text):
    text = clean_text(text)
    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))

        # Prefer ending a chunk at a paragraph or sentence boundary.
        if end < len(text):
            boundary = max(
                text.rfind("\n", start, end),
                text.rfind(". ", start, end),
                text.rfind("; ", start, end),
            )
            if boundary > start + CHUNK_SIZE // 2:
                end = boundary + 1

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end >= len(text):
            break

        start = max(end - CHUNK_OVERLAP, start + 1)

    return chunks


def add_passages(index, text, source, experiment, source_type, page=None):
    for number, chunk in enumerate(split_chunks(text), start=1):
        index.append({
            "id": f"ev-{len(index) + 1:06d}",
            "experiment": experiment,
            "source": source,
            "source_type": source_type,
            "page": page,
            "chunk": number,
            "text": chunk,
        })


def process_pdf(path, index, errors):
    try:
        reader = PdfReader(str(path))

        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                errors.append({
                    "source": str(path),
                    "error": "PDF is encrypted and could not be opened.",
                })
                return

        experiment = infer_experiment(
            f"{path} " + " ".join(
                str(page.extract_text() or "")[:300]
                for page in reader.pages[:2]
            )
        )

        before = len(index)

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            add_passages(
                index=index,
                text=text,
                source=path.name,
                experiment=experiment,
                source_type="PDF",
                page=page_number,
            )

        print(f"PDF: {path.name} | {len(index) - before} passages")

    except Exception as exc:
        errors.append({"source": str(path), "error": str(exc)})


def process_text_file(path, index, source_label=None):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
        experiment = infer_experiment(f"{path} {text[:1200]}")

        add_passages(
            index=index,
            text=text,
            source=source_label or path.name,
            experiment=experiment,
            source_type="Text metadata",
        )

    except Exception as exc:
        print(f"Skipped text file {path.name}: {exc}")


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    index = []
    errors = []
    seen_files = set()
    pdf_count = 0
    zip_count = 0
    text_count = 0

    for search_root in SEARCH_ROOTS:
        if not search_root.exists():
            print(f"Folder not found, skipping: {search_root}")
            continue

        for path in search_root.rglob("*"):
            if not path.is_file():
                continue

            # Avoid reprocessing the same physical file when roots overlap.
            resolved = str(path.resolve()).lower()
            if resolved in seen_files:
                continue
            seen_files.add(resolved)

            if path.suffix.lower() == ".pdf":
                process_pdf(path, index, errors)
                pdf_count += 1

            elif path.suffix.lower() == ".zip":
                zip_count += 1

                try:
                    with zipfile.ZipFile(path) as archive:
                        for member in archive.infolist():
                            member_path = Path(member.filename)

                            if member.is_dir():
                                continue

                            if member_path.suffix.lower() not in TEXT_EXTENSIONS:
                                continue

                            if member.file_size > 5_000_000:
                                continue

                            try:
                                with archive.open(member) as file:
                                    text = file.read().decode(
                                        "utf-8", errors="replace"
                                    )

                                experiment = infer_experiment(
                                    f"{path.name} {member.filename} {text[:1000]}"
                                )

                                add_passages(
                                    index=index,
                                    text=text,
                                    source=f"{path.name} :: {member.filename}",
                                    experiment=experiment,
                                    source_type="ZIP metadata",
                                )
                                text_count += 1

                            except Exception as exc:
                                errors.append({
                                    "source": f"{path.name} :: {member.filename}",
                                    "error": str(exc),
                                })

                except Exception as exc:
                    errors.append({"source": str(path), "error": str(exc)})

            elif path.suffix.lower() in TEXT_EXTENSIONS:
                process_text_file(path, index)
                text_count += 1

    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "index_version": 1,
        "method": "PDF page extraction and text/metadata chunking",
        "summary": {
            "passages_indexed": len(index),
            "pdf_files_scanned": pdf_count,
            "zip_archives_scanned": zip_count,
            "text_files_scanned": text_count,
            "extraction_errors": len(errors),
            "experiments": sorted({
                item["experiment"] for item in index
            }),
        },
        "passages": index,
        "errors": errors,
        "limitations": [
            "PDF text extraction can miss text contained only in scanned images.",
            "Page numbers refer to PDF page positions, not necessarily printed page labels.",
            "Experiment labels are inferred from source names and text and require review.",
            "Indexed passages are source material, not independently verified scientific conclusions.",
            "This index does not yet implement semantic search or AI-generated answers.",
        ],
    }

    OUTPUT.write_text(
        json.dumps(report, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print("\n=== SideroSpace EVIDENCE INDEX ===")
    for key, value in report["summary"].items():
        print(f"{key}: {value}")

    print(f"\nSaved index: {OUTPUT}")

    if errors:
        print("\nSome files could not be processed. Inspect the errors in the JSON report.")


if __name__ == "__main__":
    main()
