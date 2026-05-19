"""
Upscale brochure.png to a higher-resolution version using Pillow.

Uses LANCZOS resampling (best general-purpose algorithm in PIL for upscaling)
and a light unsharp-mask pass to keep edges crisp after the resize.

Usage (one-time setup):
    pip install pillow

Then run:
    cd printables
    python upscale.py            # default 4x
    python upscale.py 6          # 6x scale
    python upscale.py 4 in.png out.png   # custom paths
"""

import sys
from pathlib import Path
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent

def upscale(src: Path, dst: Path, scale: float = 4.0) -> None:
    img = Image.open(src)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")

    new_size = (int(img.width * scale), int(img.height * scale))
    print(f"Upscaling {src.name}: {img.width}x{img.height} -> {new_size[0]}x{new_size[1]} ({scale}x)")

    big = img.resize(new_size, Image.Resampling.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=2))

    big.save(dst, optimize=True)
    print(f"Wrote {dst}  ({dst.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    args = sys.argv[1:]
    scale = float(args[0]) if len(args) >= 1 else 4.0
    src = Path(args[1]) if len(args) >= 2 else HERE / "brochure.png"
    dst = Path(args[2]) if len(args) >= 3 else src.with_name(src.stem + f"_{int(scale)}x.png")
    upscale(src, dst, scale)
