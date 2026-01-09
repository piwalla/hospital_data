
from PIL import Image
import math
import os

def distance(c1, c2):
    (r1,g1,b1) = c1
    (r2,g2,b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

def make_transparent(input_path):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return

        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        # Target white/off-white background of generated images
        target_color = (255, 255, 255)
        
        for item in datas:
            rgb = item[0:3]
            dist = distance(rgb, target_color)
            # Higher tolerance for 3D renders which might have shadows/gradients
            if dist < 40: 
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        
        # Crop tight
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(input_path, "PNG")
        print(f"Processed: {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

files = [
    "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/landing/icon-3d-docs.png",
    "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/landing/icon-3d-video.png",
    "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/landing/icon-3d-hospital.png"
]

for f in files:
    make_transparent(f)
