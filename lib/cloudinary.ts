import "server-only";

import { createHash } from "node:crypto";

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

const DEFAULT_FOLDER = "cynthia-makes";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary nao configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Assina os parametros conforme a especificacao do Cloudinary: ordena as
 * chaves, junta como querystring e aplica SHA-1 concatenado ao api_secret.
 */
function sign(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export function assertValidImage(file: File): void {
  if (!allowedImageMimeTypes.includes(file.type as (typeof allowedImageMimeTypes)[number])) {
    throw new Error("Formato invalido. Use JPG, PNG ou WEBP.");
  }

  if (file.size > maxImageSizeInBytes) {
    throw new Error("Imagem muito grande. Limite de 5 MB.");
  }
}

export async function uploadImage(
  file: File,
  folder: string = DEFAULT_FOLDER,
): Promise<CloudinaryImageUpload> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  assertValidImage(file);

  const timestamp = Math.round(Date.now() / 1000).toString();
  const signature = sign({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );

  if (!response.ok) {
    throw new Error("Falha ao enviar a imagem para o Cloudinary.");
  }

  const data = (await response.json()) as {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
  };

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getConfig();

  const timestamp = Math.round(Date.now() / 1000).toString();
  const signature = sign({ public_id: publicId, timestamp }, apiSecret);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });
}
