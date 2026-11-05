"""Regenerates public/og-image.png (1200x630) from the brand logo.
Run: python3 brand/make-og-image.py   (needs Pillow; uses a macOS system font)."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
BG, FG, MUTED, BLUE = (8, 9, 13), (248, 250, 252), (148, 163, 184), (77, 179, 255)

def font(size, bold=True):
    for path in ('/System/Library/Fonts/HelveticaNeue.ttc', '/System/Library/Fonts/Helvetica.ttc'):
        try:
            return ImageFont.truetype(path, size, index=1 if bold else 0)
        except OSError:
            continue
    return ImageFont.load_default()

img = Image.new('RGB', (W, H), BG)
glow = Image.new('RGB', (W, H), BG)
ImageDraw.Draw(glow).ellipse((560, -260, 1360, 540), fill=(0, 70, 130))
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(140)), 0.55)

logo = Image.open('brand/vaultkey-logo-source.png').convert('RGBA').resize((120, 120), Image.LANCZOS)
img.paste(logo, (80, 80), logo)
d = ImageDraw.Draw(img)
d.text((224, 112), 'VaultKey', font=font(56), fill=FG)
d.text((80, 270), 'App secrets.', font=font(96), fill=FG)
d.text((80, 380), 'Outside your files.', font=font(96), fill=BLUE)
d.text((80, 520), 'Encrypted vault for API keys and passwords. Loaded at runtime.', font=font(30, False), fill=MUTED)
img.save('public/og-image.png', optimize=True)
