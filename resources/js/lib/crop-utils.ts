/**
 * Convert a data URL to a File object synchronously (no async canvas taint issues).
 */
function dataUrlToFile(dataUrl: string, filename: string): File {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    return new File([array], filename, { type: mime });
}

/**
 * Crop an image given a data: URL and pixel crop coordinates.
 * Returns a File or null.
 */
export default function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<File | null> {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(null);

                return;
            }

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height,
            );

            try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                resolve(dataUrlToFile(dataUrl, 'avatar-cropped.jpg'));
            } catch {
                resolve(null);
            }
        };
        image.onerror = () => resolve(null);
        // For data: URLs we must NOT set crossOrigin — it breaks the canvas
        image.src = imageSrc;
    });
}
