
from PIL import Image
import math

def distance(c1, c2):
    (r1,g1,b1) = c1
    (r2,g2,b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        target_color = (255, 255, 255)
        
        for item in datas:
            rgb = item[0:3]
            dist = distance(rgb, target_color)
            if dist < 80: # Increased tolerance to catch all white/off-white background
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        # Crop the image to bounding box of non-transparent pixels
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(output_path, "PNG")
        print(f"Successfully saved and trimmed transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

# Use the ORIGINAL source image to avoid compounding errors
# logo_heart_handshake_geometric_1766888664491.png
input_file = "C:/Users/highs/.gemini/antigravity/brain/1cd37186-eef2-456a-8bf7-a0ff59b8d4f2/logo_heart_handshake_geometric_1766888664491.png"
output_file = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/brand-logo-v2.png"
icon_file = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/app/icon.png"

remove_background(input_file, output_file)
remove_background(input_file, icon_file)
