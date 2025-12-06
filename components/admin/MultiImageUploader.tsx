'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  maxImages?: number;
}

export default function MultiImageUploader({
  values,
  onChange,
  label = 'Upload Images',
  folder = 'electronicscience/screenshots',
  maxImages = 10,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const removeImage = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const canUploadMore = values.length < maxImages;

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-gray-400 text-sm mb-2">
          {label} ({values.length}/{maxImages})
        </label>
      )}

      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {values.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video bg-black/30 rounded-lg overflow-hidden border border-white/10"
            >
              <Image
                src={url}
                alt={`Screenshot ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Widget */}
      {canUploadMore && (
        <CldUploadWidget
          uploadPreset="unsigned_electronicscience"
          options={{
            folder,
            multiple: true,
            maxFiles: maxImages - values.length,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 5000000, // 5MB
          }}
          onSuccess={(result: any) => {
            if (result?.info?.secure_url) {
              onChange([...values, result.info.secure_url]);
            }
          }}
          onQueuesEnd={() => setUploading(false)}
          onQueuesStart={() => setUploading(true)}
          onError={(error) => {
            setUploading(false);
            console.error('Upload error:', error);
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={uploading || !canUploadMore}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white hover:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Add Images</span>
                </div>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Fallback: Add URL manually */}
      <details className="text-xs">
        <summary className="text-gray-500 cursor-pointer hover:text-gray-400">
          Or add URL manually
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            id="manual-url-input"
            placeholder="https://..."
            className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-white text-xs focus:outline-none focus:border-teal-500"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById('manual-url-input') as HTMLInputElement;
              if (input?.value.trim()) {
                onChange([...values, input.value.trim()]);
                input.value = '';
              }
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-3 rounded text-xs"
          >
            Add
          </button>
        </div>
      </details>
    </div>
  );
}
