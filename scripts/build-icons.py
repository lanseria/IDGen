# 从 scripts/icon-source.png 生成全套站点图标：
#   public/favicon.ico        透明底（16/32/48）
#   public/logo.png           透明底 256，页面标题旁使用
#   public/pwa-192x192.png    白底
#   public/pwa-512x512.png    白底
#   public/maskable-icon.png  白底 512
#   public/apple-touch-icon.png 白底 180
# 运行：uv run --with pillow --with numpy scripts/build-icons.py
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(__file__).resolve().parent / 'icon-source.png'
PUBLIC = ROOT / 'public'

# 与背景色距离低于 lo 视为背景，高于 hi 视为前景，中间线性过渡（抗锯齿边缘）
ALPHA_LO = 10
ALPHA_HI = 40
CONTENT_PADDING_RATIO = 0.06


def load_rgba() -> Image.Image:
    img = Image.open(SOURCE).convert('RGB')
    px = np.asarray(img).astype(np.float64)

    border = np.concatenate([px[0], px[-1], px[:, 0], px[:, -1]])
    bg = np.median(border, axis=0)

    dist = np.abs(px - bg).max(axis=2)
    alpha = np.clip((dist - ALPHA_LO) / (ALPHA_HI - ALPHA_LO), 0, 1)

    # 按 alpha 反推纯前景色，避免灰底残留形成光晕
    fg = bg + (px - bg) / np.maximum(alpha, 1e-6)[..., None]
    fg = np.clip(fg, 0, 255)

    rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def crop_to_content(img: Image.Image) -> Image.Image:
    left, top, right, bottom = img.getchannel('A').getbbox()
    width, height = right - left, bottom - top
    side = int(max(width, height) * (1 + CONTENT_PADDING_RATIO * 2))
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(img.crop((left, top, right, bottom)), (int((side - width) / 2), int((side - height) / 2)))
    return square


def flatten_white(img: Image.Image) -> Image.Image:
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, img).convert('RGB')


def resize(img: Image.Image, size: int) -> Image.Image:
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    rgba = load_rgba()
    solid = flatten_white(rgba)
    content = crop_to_content(rgba)

    resize(content, 256).save(PUBLIC / 'logo.png')
    resize(content, 256).save(
        PUBLIC / 'favicon.ico',
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    resize(solid, 192).save(PUBLIC / 'pwa-192x192.png')
    resize(solid, 512).save(PUBLIC / 'pwa-512x512.png')
    resize(solid, 512).save(PUBLIC / 'maskable-icon.png')
    resize(solid, 180).save(PUBLIC / 'apple-touch-icon.png')
    print('icons generated to', PUBLIC)


if __name__ == '__main__':
    main()
