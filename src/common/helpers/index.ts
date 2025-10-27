import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

// Helper to save a base64 data URL to uploads/products and return the saved relative path
export function saveBase64Image(dataUrl: string): string {
  try {
    const matches = dataUrl.match(
      /^data:(image\/(png|jpeg|jpg|gif));base64,(.+)$/,
    );
    if (!matches) throw new Error('Formato de imagen no válido');
    const mime = matches[1];
    const ext =
      mime.split('/')[1] === 'jpeg' ? '.jpg' : `.${mime.split('/')[1]}`;
    const base64Data = matches[3];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    const uploadPath = './uploads/products';
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
    } catch (e) {}
    const fullPath = `${uploadPath}/${filename}`;
    fs.writeFileSync(fullPath, buffer);
    return `uploads/products/${filename}`;
  } catch (e) {
    throw new BadRequestException('No se pudo procesar la imagen base64');
  }
}

export function flattenValidationErrors(errors: any[]): string[] {
  const messages: string[] = [];
  const collect = (errs: any[]) => {
    for (const e of errs) {
      if (e.constraints) {
        for (const key of Object.keys(e.constraints)) {
          messages.push(e.constraints[key]);
        }
      }
      if (e.children && e.children.length) {
        collect(e.children);
      }
    }
  };
  collect(errors);
  return messages;
}
