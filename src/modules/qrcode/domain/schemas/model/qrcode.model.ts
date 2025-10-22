import { Buffer } from 'buffer';

export class QRCodeModel {
  private qrcodeId: number;
  private acometidaId: string;
  private imagenBytea: Buffer;
  private qrcodeUrl: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    acometidaId: string,
    imagenBytea: Buffer,
    qrcodeUrl: string,
    qrcodeId?: number

  ) {
    this.qrcodeId = qrcodeId || 0;
    this.acometidaId = acometidaId;
    this.imagenBytea = imagenBytea;
    this.qrcodeUrl = qrcodeUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getQrcodeId(): number {
    return this.qrcodeId;
  }

  getAcometidaId(): string {
    return this.acometidaId;
  }

  getImagenBytea(): Buffer {
    return this.imagenBytea;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getQrcodeUrl(): string {
    return this.qrcodeUrl;
  }

  setQrcodeUrl(url: string): void {
    this.qrcodeUrl = url;
    this.updatedAt = new Date();
  }

  setImagenBytea(imagen: Buffer): void {
    if (!Buffer.isBuffer(imagen) || imagen.length === 0) {
      throw new Error('imagenBytea debe ser un Buffer no vacío');
    }
    this.imagenBytea = imagen;
    this.updatedAt = new Date();
  }

  setAcometidaId(id: string): void {
    this.acometidaId = id;
    this.updatedAt = new Date();
  }

  toBase64(): string {
    return this.imagenBytea.toString('base64');
  }

  static fromBase64(qrcodeId: number, acometidaId: string, base64Data: string, qrcodeUrl: string): QRCodeModel {
    const buffer = Buffer.from(base64Data, 'base64');
    return new QRCodeModel(acometidaId, buffer, qrcodeUrl, qrcodeId);
  }
}