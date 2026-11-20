import os
import glob
from PIL import Image

os.makedirs('images/thumbs', exist_ok=True)

total_before = 0
total_after_full = 0
total_thumbs = 0

for filepath in glob.glob('images/*.jpg'):
    filename = os.path.basename(filepath)
    size_before = os.path.getsize(filepath)
    total_before += size_before

    with Image.open(filepath) as img:
        # Convert RGBA/P to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        orig_w, orig_h = img.size

        # 1. Custom settings per image type
        if filename == 'bachkhoa_campus_bg.jpg':
            max_size = (960, 960)
            quality = 75
        elif filename == 'tuan_phong_portrait.jpg':
            max_size = (800, 800)
            quality = 83
        else: # Gallery images
            max_size = (1440, 1440)
            quality = 82

            # Also create 480px thumbnail for polaroid cards
            thumb = img.copy()
            thumb.thumbnail((480, 480), Image.Resampling.LANCZOS)
            thumb_path = os.path.join('images', 'thumbs', filename)
            thumb.save(thumb_path, 'JPEG', quality=78, optimize=True, progressive=True)
            total_thumbs += os.path.getsize(thumb_path)

        # Optimize full image in-place
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(filepath, 'JPEG', quality=quality, optimize=True, progressive=True)
        size_after = os.path.getsize(filepath)
        total_after_full += size_after

        print(f"{filename}: {size_before/1024:.1f} KB -> {size_after/1024:.1f} KB (saved {((size_before-size_after)/size_before)*100:.1f}%)")

print("--------------------------------------------------")
print(f"Total Full Images Before: {total_before / (1024*1024):.2f} MB")
print(f"Total Full Images After:  {total_after_full / (1024*1024):.2f} MB (Saved {((total_before-total_after_full)/total_before)*100:.1f}%)")
print(f"Total Thumbnails (16 items): {total_thumbs / (1024*1024):.2f} MB (~{total_thumbs / 16 / 1024:.1f} KB/thumb)")
print(f"Initial Page Load Image Weight: {(total_thumbs + os.path.getsize('images/bachkhoa_campus_bg.jpg') + os.path.getsize('images/tuan_phong_portrait.jpg')) / 1024:.1f} KB!")

