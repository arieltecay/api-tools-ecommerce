import { UploadApiOptions } from 'cloudinary';

export interface UploadStreamOptions extends UploadApiOptions {
  folder: string;
  transformation?: { quality: string; fetch_format: string; }[];
}
