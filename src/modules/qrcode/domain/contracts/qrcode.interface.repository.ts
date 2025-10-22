import { QRCodeResponse } from "../schemas/dto/response/qrcode.response";
import { QRCodeModel } from "../schemas/model/qrcode.model";

export interface InterfaceQRcodeRepository {
  createQRcode(qrcodeModel: QRCodeModel): Promise<QRCodeResponse | null>;
  findQRCodeByAcometidaId(acometidaId: string): Promise<QRCodeResponse | null>;
  findAcometidaById(acometidaId: string): Promise<boolean>;
  verifyIfExistQRCodeByAcmetidaId(acometidaId: string): Promise<boolean>;
}