"""
Render every A4-portrait HTML in printables/ to a sibling PDF.

Walks these folders and converts each .html to .pdf in-place:
    qr/         -> qr/qr.pdf
    personas/   -> personas/persona_*.pdf
    cvs/        -> cvs/cv_*.pdf
    jobs/       -> jobs/job_*.pdf

Uses Playwright (bundles its own Chromium, no system deps).
The brochure (A4 landscape) and tarpaulin (24x72in) are NOT touched here
since they have their own page sizes.

Usage (one-time setup):
    pip install playwright
    python -m playwright install chromium

Then run:
    python scripts/render_pdfs.py             # render everything
    python scripts/render_pdfs.py personas    # only one folder
    python scripts/render_pdfs.py cvs jobs    # any subset
"""

import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

PRINTABLES = Path(__file__).resolve().parent.parent
TARGETS = ["qr", "personas", "cvs", "jobs"]


def html_files(folder: Path) -> list[Path]:
    return sorted(folder.glob("*.html"))


def render(page, src: Path, dst: Path) -> None:
    page.goto(src.as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.pdf(
        path=str(dst),
        width="8.27in",
        height="11.69in",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        prefer_css_page_size=True,
    )


def main() -> None:
    requested = sys.argv[1:] or TARGETS
    folders = []
    for name in requested:
        f = PRINTABLES / name
        if not f.is_dir():
            print(f"skip: {name} (not a folder under printables/)")
            continue
        folders.append(f)

    if not folders:
        print("nothing to do")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        total = 0
        for folder in folders:
            files = html_files(folder)
            if not files:
                print(f"{folder.name}/  (no .html files)")
                continue
            print(f"{folder.name}/")
            for src in files:
                dst = src.with_suffix(".pdf")
                render(page, src, dst)
                size_kb = dst.stat().st_size / 1024
                print(f"  {src.name}  ->  {dst.name}  ({size_kb:.1f} KB)")
                total += 1
        browser.close()
        print(f"\nDone. {total} PDF(s) written.")


if __name__ == "__main__":
    main()
