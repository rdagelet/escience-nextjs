import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary for server-side operations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper to extract public_id from Cloudinary URL (for future deletion feature)
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}

// Helper to build Cloudinary URL with transformations
export function buildImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale';
  quality?: number;
}): string {
  const { width = 800, height, crop = 'fill', quality = 80 } = options || {};

  const transformations = [
    `w_${width}`,
    height ? `h_${height}` : null,
    `c_${crop}`,
    `q_${quality}`,
    'f_auto', // Auto format
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}
