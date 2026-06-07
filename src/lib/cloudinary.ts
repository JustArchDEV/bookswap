import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
};

export async function uploadImage(file: Buffer, folder = 'bookswap/books'): Promise<CloudinaryUploadResult> {
  const base64 = file.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
  });

  return result as CloudinaryUploadResult;
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}