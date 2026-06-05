export type CloudinaryImageUpload = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
};

export const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const maxImageSizeInBytes = 5 * 1024 * 1024;
