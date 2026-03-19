import cloudinary from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export const uploadImage = async (fileBuffer: Buffer, folder: string, publicId?: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const options: any = {
      folder: `tools-store/${folder}`,
      resource_type: 'auto',
      // Cloudinary transformations on upload (optional, but good for standardization)
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed with no result'));
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Generates a transformed URL for an existing image
 * @param url Original Cloudinary URL
 * @param width Desired width
 * @param height Desired height
 * @param crop Crop mode (default: fill)
 */
export const getOptimizedUrl = (url: string, width?: number, height?: number, crop: string = 'fill'): string => {
  if (!url.includes('cloudinary.com')) return url;

  // Example: res.cloudinary.com/demo/image/upload/sample.jpg
  // Target: res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill,f_auto,q_auto/sample.jpg
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (width || height) transformations += `,c_${crop}`;

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export const deleteImage = async (publicId: string): Promise<any> => {
  return await cloudinary.uploader.destroy(publicId);
};
