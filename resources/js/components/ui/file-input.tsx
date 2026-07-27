import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import { Button } from './button';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
    value?: File | null;
    onFileChange?: (file: File | null) => void;
    error?: string;
    previewUrl?: string | null;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    ({ className, value, onFileChange, error, previewUrl, onChange, ...props }, ref) => {
        const [dragActive, setDragActive] = useState(false);
        const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
        const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(previewUrl || null);

        const handleFile = (file: File | null) => {
            setSelectedFile(file);
            if (onFileChange) {
                onFileChange(file);
            }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            handleFile(file);
            if (onChange) {
                onChange(e);
            }
        };

        const handleDrag = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true);
            } else if (e.type === 'dragleave') {
                setDragActive(false);
            }
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        };

        const clearFile = () => {
            handleFile(null);
            setCurrentPreviewUrl(null);
        };

        const showPreview = selectedFile || currentPreviewUrl;

        return (
            <div className={cn('w-full', className)}>
                {!showPreview ? (
                    <div
                        className={cn(
                            'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                            dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                            error && 'border-destructive/50'
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={ref}
                            type="file"
                            className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                            onChange={handleChange}
                            {...props}
                        />
                        <div className="flex flex-col items-center justify-center pb-6 pt-5 text-muted-foreground">
                            <UploadCloud className="mb-3 h-8 w-8" />
                            <p className="mb-1 text-sm font-semibold">
                                Click to upload <span className="font-normal">or drag and drop</span>
                            </p>
                            <p className="text-xs">SVG, PNG, JPG or PDF</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                {selectedFile && selectedFile.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="h-full w-full rounded-lg object-cover"
                                    />
                                ) : currentPreviewUrl ? (
                                    <img
                                        src={currentPreviewUrl}
                                        alt="Preview"
                                        className="h-full w-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <FileIcon className="h-5 w-5" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {selectedFile ? selectedFile.name : 'Current Image'}
                                </p>
                                {selectedFile && (
                                    <p className="text-xs text-muted-foreground">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="shrink-0">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                        </Button>
                        <input
                            ref={ref}
                            type="file"
                            className="hidden"
                            onChange={handleChange}
                            {...props}
                        />
                    </div>
                )}
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
        );
    }
);
FileInput.displayName = 'FileInput';
