"""
Render tarpaulin.html -> tarpaulin.pdf at exact 24in x 72in (2ft x 6ft).

Uses Playwright (Python). It bundles its own Chromium, so there are no
system-level dependencies (no GTK, no wkhtmltopdf). It also runs the page's
JS, so the footer QR pattern renders.

The existing @media print rules in tarpaulin.html already hide the
screen-only instruction box and lock the standee to 24in x 72in, so the PDF
contains only the tarp itself.

Usage (one-time setup):
    pip install playwright
    python -m playwright install chromium

Then run:
    cd docs
    python render_tarpaulin.py

Output: docs/tarpaulin.pdf
"""

from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SRC  = HERE.parent / "printables" / "tarpaulin" / "tarpaulin.html"
OUT_FULL = HERE / "tarpaulin.pdf"             # 24in x 72in print master
OUT_A4   = HERE / "tarpaulin_a4.pdf"          # A4-portrait, fits on one sheet

# The tarp content is laid out at 24in wide x 72in tall (1:3 aspect).
# To fit one A4 portrait page (8.27in x 11.69in) we scale by height:
#   scale = 11.69 / 72 = 0.1624
# Scaled content becomes ~3.9in wide x 11.69in tall, centered on the A4.
A4_SCALE = 11.69 / 72  # ~0.1624

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(SRC.as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")

    # 1) Full-size print master (2ft x 6ft) — unchanged.
    page.pdf(
        path=str(OUT_FULL),
        width="24in",
        height="72in",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        prefer_css_page_size=True,
        page_ranges="1",
    )

    # 2) A4-portrait web/viewing copy, shrunk-to-fit.
    page.pdf(
        path=str(OUT_A4),
        format="A4",
        print_background=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        prefer_css_page_size=False,
        scale=A4_SCALE,
        page_ranges="1",
    )

    browser.close()

print(f"Wrote {OUT_FULL}")
print(f"Wrote {OUT_A4}")
