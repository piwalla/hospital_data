
from PIL import Image
import math

def is_white(rgb):
    # Aggressive white detection
    return rgb[0] > 240 and rgb[1] > 240 and rgb[2] > 240

def process_logos(input_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        green_data = [] # Original Green, Transparent Bg
        white_data = [] # White Logo, Transparent Bg

        for item in datas:
            rgb = item[0:3]
            if is_white(rgb):
                # Transparent for both
                green_data.append((255, 255, 255, 0))
                white_data.append((255, 255, 255, 0))
            else:
                # It's part of the logo
                # Green version: keep original
                green_data.append(item)
                # White version: make it pure white
                white_opacity = item[3] # Preserving alpha if any
                white_data.append((255, 255, 255, white_opacity))

        # Save Green Version
        img_green = Image.new("RGBA", img.size)
        img_green.putdata(green_data)
        bbox = img_green.getbbox()
        if bbox: img_green = img_green.crop(bbox)
        img_green.save("c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/logo-green.png", "PNG")

        # Save White Version
        img_white = Image.new("RGBA", img.size)
        img_white.putdata(white_data)
        bbox = img_white.getbbox() # Crop same way
        if bbox: img_white = img_white.crop(bbox)
        img_white.save("c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/public/logo-white.png", "PNG")
        
        print("Success: Generated logo-green.png and logo-white.png")

    except Exception as e:
        print(f"Error: {e}")

input_path = "C:/Users/highs/.gemini/antigravity/brain/1cd37186-eef2-456a-8bf7-a0ff59b8d4f2/logo_heart_handshake_geometric_1766888664491.png"
process_logos(input_path)
