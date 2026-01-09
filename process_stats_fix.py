
from PIL import Image
import math
import os

def distance(c1, c2):
    (r1,g1,b1) = c1
    (r2,g2,b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

def remove_background(input_path, output_path):
    try:
        if not os.path.exists(input_path):
            print(f"Not found: {input_path}")
            return
            
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        # Target white
        target_color = (255, 255, 255)
        
        for item in datas:
            rgb = item[0:3]
            dist = distance(rgb, target_color)
            
            # 60 is aggressive enough for clay render
            if dist < 60: 
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(output_path, "PNG")
        print(f"Saved: {output_path}")
    except Exception as e:
        print(f"Error: {e}")

base = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/landing"
files = {
    "icon-3d-docs.png": "icon-3d-docs-transparent.png",
    "icon-3d-video.png": "icon-3d-video-transparent.png",
    "icon-3d-hospital.png": "icon-3d-hospital-transparent.png",
    "icon-3d-pin.png": "icon-3d-pin-transparent.png"
}

print("Starting Fix...")
for src, dest in files.items():
    inp = os.path.join(base, src)
    out = os.path.join(base, dest)
    remove_background(inp, out)
print("Fix Done.")
