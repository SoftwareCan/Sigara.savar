"""Create web-sized copies of supplied store art; preserve the full composition.

Usage: python _build/optimize-gallery.py "path/to/HazırTR"
Requires Pillow, available in the bundled workspace Python runtime.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
output = root / 'assets' / 'gallery'
output.mkdir(parents=True, exist_ok=True)
manifest = []
for number in range(1, 8):
    original = source / f'{number}.png'
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        width, height = image.size
        variants = []
        for size in (360, 720):
            resized = image.resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
            for extension, options in [('webp', {'quality': 86, 'method': 6}), ('avif', {'quality': 70, 'speed': 6})]:
                target = output / f'store-{number:02d}-{size}.{extension}'
                resized.save(target, **options)
                variants.append({'path': '/' + target.relative_to(root).as_posix(), 'width': resized.width, 'height': resized.height, 'bytes': target.stat().st_size})
        manifest.append({'id': f'store-{number:02d}', 'originalName': original.name, 'originalSha256': hashlib.sha256(original.read_bytes()).hexdigest(), 'width': width, 'height': height, 'variants': variants})
(root / '_build' / 'content' / 'gallery.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(manifest)} supplied images in two sizes and two formats; originals unchanged.')
