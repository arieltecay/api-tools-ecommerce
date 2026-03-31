import cloudinary from '../../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { UploadStreamOptions } from './types';

export const uploadImage = async (
  fileBuffer: Buffer, 
  folder: string, 
  publicId?: string,
  removeBackground: boolean = false
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const options: UploadStreamOptions = {
      folder: `tools-store/${folder}`,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    };

    if (removeBackground) {
      options.background_removal = 'cloudinary_ai';
    }

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

export const getOptimizedUrl = (url: string, width?: number, height?: number, crop: string = 'fill'): string => {
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (width || height) transformations += `,c_${crop}`;

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export const deleteImage = async (publicId: string): Promise<{ result: string }> => {
  return await cloudinary.uploader.destroy(publicId);
};
