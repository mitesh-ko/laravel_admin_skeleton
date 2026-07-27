import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './dialog';
import { Button } from './button';
import getCroppedImg from '@/lib/crop-utils';

interface ImageCropperProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onCropComplete: (croppedFile: File) => void;
}

type CroppedAreaPixels = { x: number; y: number; width: number; height: number };

export function ImageCropper({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state every time a new image is loaded into the dialog
    useEffect(() => {
        if (isOpen && imageSrc) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
        }
    }, [isOpen, imageSrc]);

    const handleCropComplete = useCallback((_: unknown, pixels: CroppedAreaPixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const mediaSizeRef = React.useRef<{ naturalWidth: number; naturalHeight: number } | null>(null);

    const handleDone = async () => {
        if (!imageSrc) return;

        setIsProcessing(true);
        try {
            let pixelCrop = croppedAreaPixels;

            // If user never moved the crop, derive a centred square crop from the rendered image
            if (!pixelCrop) {
                const mediaSize = mediaSizeRef.current;
                if (!mediaSize) {
                    setIsProcessing(false);
                    return;
                }
                const size = Math.min(mediaSize.naturalWidth, mediaSize.naturalHeight);
                pixelCrop = {
                    x: Math.round((mediaSize.naturalWidth - size) / 2),
                    y: Math.round((mediaSize.naturalHeight - size) / 2),
                    width: size,
                    height: size,
                };
            }

            const croppedFile = await getCroppedImg(imageSrc, pixelCrop);
            if (croppedFile) {
                onCropComplete(croppedFile);
            } else {
                console.error('getCroppedImg returned null — canvas may have failed');
            }
        } catch (e) {
            console.error('Crop error:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                    <DialogDescription>
                        Drag to reposition, scroll or pinch to zoom. Click <strong>Done</strong> when ready.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mt-2 h-[400px] w-full overflow-hidden rounded-md bg-black/10">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                            onMediaLoaded={(mediaSize) => {
                                mediaSizeRef.current = mediaSize;
                            }}
                            cropShape="round"
                            showGrid={false}
                            minZoom={0.5}
                        />
                    )}
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button onClick={handleDone} disabled={isProcessing || !imageSrc}>
                        {isProcessing ? 'Processing...' : 'Done'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
