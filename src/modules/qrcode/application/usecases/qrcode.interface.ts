import { Buffer } from 'buffer';
import { QRCodeFather } from '../../domain/schemas/model/qrcode';


export interface InterfaceCodeService {
  generateQRCode(config: CodeConfig): Promise<ResultCode>;
  //saveCode(config: CodeConfig, buffer: Buffer, id: string): Promise<string>;
}

export interface CodeConfig {
  data: any;
  acometidaId: string;
  type: {
    validateData: (data: any) => void;
    getBcid: () => string;
    getGenerationOptions: () => Record<string, any>;
  };
  options?: {
    scale?: number;
    height?: number;
    includetext?: boolean;
    margin?: number;
    size?: number;
    logoPath?: string;
    logoScale?: number;
    title?: string;
    titleFontSize?: number;
    titleColor?: string;
    qrColorDark?: string;
    qrColorLight?: string;
  };
}


export interface ResultCode { id: string; buffer: Buffer; urlQRCode: string }