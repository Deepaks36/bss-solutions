import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';

interface EditableImageProps {
    src: string;
    alt: string;
    onSave: (dataUrl: string) => void;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    editMode: boolean;
}

export function EditableImage({
    src,
    alt,
    onSave,
    className = '',
    width,
    height,
    fill = false,
    editMode,
}: EditableImageProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            onSave(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`group relative ${fill ? 'h-full w-full' : ''}`}>
            {src ? (
                fill ? (
                    <img
                        src={src}
                        alt={alt}
                        className={`absolute inset-0 h-full w-full object-cover ${className}`}
                        loading="lazy"
                    />
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className={className}
                        loading="lazy"
                    />
                )
            ) : (
                <div
                    className={`flex items-center justify-center bg-gray-100 ${fill ? 'absolute inset-0 h-full w-full' : ''} ${className}`}
                    style={!fill ? { width: width || '100%', height: height || 200 } : undefined}
                >
                    <span className="text-gray-400 text-sm">{alt}</span>
                </div>
            )}

            {editMode && (
                <>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg"
                        aria-label="Upload image"
                    >
                        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg">
                            <ImagePlus className="h-4 w-4" />
                            Upload Image
                        </div>
                    </button>
                </>
            )}
        </div>
    );
}
