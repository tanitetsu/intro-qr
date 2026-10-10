const ICON_MAX_PX = 256;
const ICON_JPEG_QUALITY = 0.82;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/** プロフィールアイコン用に中央正方形へ切り出し、JPEG data URL にする */
export async function fileToIconDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const side = Math.min(img.width, img.height);
    if (side <= 0) throw new Error("Invalid image");
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    const out = Math.min(ICON_MAX_PX, side);
    const canvas = document.createElement("canvas");
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
    return canvas.toDataURL("image/jpeg", ICON_JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
