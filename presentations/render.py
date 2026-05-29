"""
render.py - Convert presentation HTMLs to PDF.

Outputs (written next to the corresponding .html):
    post_exhibit_report.html  ->  post_exhibit_report.pdf   (A4 portrait)
    slides.html               ->  slides.pdf                (16:9 landscape,
                                                             one slide per page)

Requires Playwright with Chromium. In your venv:
    pip install playwright
    python -m playwright install chromium

Then:
    python presentations/render.py              # render both
    python presentations/render.py report       # only the A4 report
    python presentations/render.py slides       # only the deck
"""

from __future__ import annotations

import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent

JOBS = {
    "report": {
        "src": HERE / "post_exhibit_report.html",
        "dst": HERE / "post_exhibit_report.pdf",
        "pdf_kwargs": {
            "format": "A4",
            "print_background": True,
            "prefer_css_page_size": True,
            "margin": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
        },
    },
    "slides": {
        "src": HERE / "slides.html",
        "dst": HERE / "slides.pdf",
        "pdf_kwargs": {
            "width": "13.333in",
            "height": "7.5in",
            "print_background": True,
            "prefer_css_page_size": True,
            "margin": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
        },
    },
}


def render(job: dict) -> None:
    src: Path = job["src"]
    dst: Path = job["dst"]
    if not src.exists():
        print(f"skip: {src.name} (not found)")
        return
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.emulate_media(media="print")
        page.goto(src.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts && document.fonts.ready")
        page.pdf(path=str(dst), **job["pdf_kwargs"])
        browser.close()
    kb = dst.stat().st_size / 1024
    print(f"  {src.name}  ->  {dst.name}  ({kb:.1f} KB)")


def main() -> None:
    requested = sys.argv[1:] or list(JOBS.keys())
    for name in requested:
        if name not in JOBS:
            print(f"skip: {name} (unknown; choose from {list(JOBS)})")
            continue
        render(JOBS[name])


if __name__ == "__main__":
    main()
