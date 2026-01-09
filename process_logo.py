
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
        # Target white
        target_color = (255, 255, 255)
        
        for item in datas:
            # Check deviation from white
            # RGB is first 3 items
            rgb = item[0:3]
            dist = distance(rgb, target_color)
            
            # Threshold: allows for some off-white/grayish anti-aliasing
            # 50 is roughly equivalent to > 205 in all channels
            if dist < 50: 
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved transparent image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

input_file = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/brand-logo.png"
output_file = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/brand-logo-transparent.png"
# Update icon too
icon_file = "c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/app/icon.png"

remove_background(input_file, output_file)
remove_background(input_file, icon_file)
