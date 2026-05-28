#!/usr/bin/env python3
"""Optimaliseer + roteer afbeeldingen voor de Nordic Cube site."""
from PIL import Image, ImageOps
from pathlib import Path

SRC = Path("assets")
OUT = Path("site/images")
OUT.mkdir(parents=True, exist_ok=True)

# (bron-bestand, doel-naam, max breedte) — EXIF-rotatie wordt automatisch toegepast
JOBS = [
    ("892323f9-d2a0-40ec-a8e7-8e9146425e97.png", "tuin-sauna.jpg", 2000),
    ("IMG_1504.jpeg", "sauna-tuin-zonnig.jpg", 2000),
    ("IMG_1518.jpeg", "sauna-parasol.jpg", 2000),
    ("IMG_1531.jpeg", "sauna-voorkant.jpg", 2000),
    ("IMG_1535.jpeg", "sauna-interieur.jpg", 2000),
    ("IMG_1541.jpeg", "sauna-deur.jpg", 2000),
    ("IMG_1606.jpeg", "sauna-avond.jpg", 2000),
    ("LOGO.png", "logo.png", 600),
]

for src_name, dst_name, max_w in JOBS:
    src = SRC / src_name
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
    dst = OUT / dst_name
    if dst.suffix.lower() in (".jpg", ".jpeg"):
        img = img.convert("RGB")
        img.save(dst, "JPEG", quality=85, optimize=True, progressive=True)
    else:
        img.save(dst, optimize=True)
    print(f"{src_name} -> {dst_name} ({img.width}x{img.height})")

print("Klaar.")
