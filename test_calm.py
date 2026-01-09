
import os
import sys
try:
    print("Files in public/landing:")
    path = os.path.join(os.getcwd(), "public/landing")
    if os.path.exists(path):
        print(os.listdir(path))
    else:
        print("Folder not found:", path)
    
    import PIL
    print("PIL version:", PIL.__version__)
    from PIL import Image
    print("PIL Image imported")

except Exception as e:
    print("Error:", e)
