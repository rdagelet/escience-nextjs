'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onPublicIdChange?: (publicId: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onPublicIdChange,
  label = 'Upload Image',
  folder = 'electronicscience',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-gray-400 text-sm mb-2">{label}</label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-full h-48 bg-black/30 rounded-lg overflow-hidden border border-white/10">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="unsigned_electronicscience"
        options={{
          folder,
          maxFiles: 1,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          maxFileSize: 5000000, // 5MB
        }}
        onSuccess={(result: any) => {
          setUploading(false);
          if (result?.info?.secure_url) {
            onChange(result.info.secure_url);
            if (onPublicIdChange && result?.info?.public_id) {
              onPublicIdChange(result.info.public_id);
            }
          }
        }}
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
            disabled={uploading}
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
                <span>{value ? 'Change Image' : 'Upload Image'}</span>
              </div>
            )}
          </button>
        )}
      </CldUploadWidget>

      {/* Fallback URL Input */}
      <details className="text-xs">
        <summary className="text-gray-500 cursor-pointer hover:text-gray-400">
          Or paste URL manually
        </summary>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full bg-black/50 border border-white/10 rounded p-2 text-white text-xs focus:outline-none focus:border-teal-500"
        />
      </details>
    </div>
  );
}
