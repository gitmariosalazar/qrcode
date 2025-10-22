import { Buffer } from 'buffer';

export class CreateQRCodeRequest {
  acometidaId: string;
  imagenBytea: Buffer;
  qrcodeUrl: string;

  constructor(
    acometidaId: string,
    imagenBytea: Buffer,
    qrcodeUrl: string
  ) {
    this.acometidaId = acometidaId
    this.imagenBytea = imagenBytea
    this.qrcodeUrl = qrcodeUrl
  }
}