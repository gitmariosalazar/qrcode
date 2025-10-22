import { CreateQRCodeRequest } from "../../domain/schemas/dto/request/create.qrcode.request";
import { QRCodeResponse } from "../../domain/schemas/dto/response/qrcode.response";

export interface InterfaceQrCodeUseCase {
  createQRcode(qrcodeRequest: CreateQRCodeRequest): Promise<QRCodeResponse | null>;
  findQRCodeByAcometidaId(acometidaId: string): Promise<QRCodeResponse | null>;
  findAcometidaById(acometidaId: string): Promise<boolean>;
  verifyIfExistQRCodeByAcmetidaId(acometidaId: string): Promise<boolean>;
}