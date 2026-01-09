
from PIL import Image
import os
import sys

def process_file(src_rel, dest_rel):
    try:
        cwd = os.getcwd()
        src_full = os.path.join(cwd, src_rel)
        dest_full = os.path.join(cwd, dest_rel)

        print(f"Reading: {src_full}")
        if not os.path.exists(src_full):
            print(f"Error: Source not found: {src_full}", file=sys.stderr)
            return

        img = Image.open(src_full).convert("RGBA")
        datas = img.getdata()

        newData = []
        # Aggressive white removal: >230 on all channels
        for item in datas:
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        
        img.save(dest_full, "PNG")
        print(f"Success: Saved to {dest_full}")

    except Exception as e:
        print(f"EXCEPTION processing {src_rel}: {e}", file=sys.stderr)

files_map = {
    "public/landing/icon-3d-docs.png": "public/landing/icon-3d-docs-clean.png",
    "public/landing/icon-3d-video.png": "public/landing/icon-3d-video-clean.png",
    "public/landing/icon-3d-hospital.png": "public/landing/icon-3d-hospital-clean.png",
    "public/landing/icon-3d-pin.png": "public/landing/icon-3d-pin-clean.png"
}

print("Starting V2 Processing...")
for src, dest in files_map.items():
    process_file(src, dest)
print("V2 Done.")
