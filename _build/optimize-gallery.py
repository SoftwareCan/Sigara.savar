"""Create web-sized copies of supplied store art; preserve the full composition.

Usage: python _build/optimize-gallery.py "path/to/HazırTR"
       python _build/optimize-gallery.py "path/to/HazırEN" en
An optional locale writes into its own asset directory and manifest; the
default Turkish assets and manifest remain unchanged.
Requires Pillow, available in the bundled workspace Python runtime.
"""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('locale', nargs='?', default='tr', choices=('tr', 'en', 'de', 'es', 'fr', 'pt-BR', 'it'))
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
source = args.source
def original_path(number):
    standard = source / f'{number}.png'
    if standard.is_file():
        return standard
    # The supplied French export uses FR1.png, FR2 .png, … .
    matches = [p for p in source.glob('*.png') if p.stem.replace(' ', '') == f'FR{number}']
    return matches[0] if len(matches) == 1 else standard

missing = [str(original_path(number)) for number in range(1, 8) if not original_path(number).is_file()]
if missing:
    parser.error('Missing source images: ' + ', '.join(missing))
output = root / 'assets' / 'gallery'
manifest_name = 'gallery.json'
if args.locale != 'tr':
    output = output / args.locale
    manifest_name = f'gallery-{args.locale}.json'
output.mkdir(parents=True, exist_ok=True)
manifest = []
for number in range(1, 8):
    original = original_path(number)
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
(root / '_build' / 'content' / manifest_name).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(manifest)} supplied {args.locale} images in two sizes and two formats; originals unchanged.')
