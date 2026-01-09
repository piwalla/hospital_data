from PIL import Image
import os

def process_file(path):
    try:
        full_path = os.path.abspath(path)
        if not os.path.exists(full_path):
            print(f"Skipping missing: {full_path}")
            return

        print(f"Processing: {full_path}")
        img = Image.open(full_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # aggressive white removal
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(full_path, "PNG")
        print(f"Saved: {full_path}")
    except Exception as e:
        print(f"Error on {path}: {e}")

files = [
    "public/landing/icon-3d-docs.png", 
    "public/landing/icon-3d-video.png", 
    "public/landing/icon-3d-hospital.png", 
    "public/landing/icon-3d-pin.png"
]

print("Starting Direct Processing...")
for f in files:
    process_file(f)
print("Done.")
