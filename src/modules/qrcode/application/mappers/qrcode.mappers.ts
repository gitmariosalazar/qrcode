import { CreateQRCodeRequest } from "../../domain/schemas/dto/request/create.qrcode.request";
import { QRCodeModel } from "../../domain/schemas/model/qrcode.model";

export class QRCodeMapper {
  static fromCreateQRCodeRequestToQRCodeModel(qrcodeRequest: CreateQRCodeRequest): QRCodeModel {
    const qrcodeModel: QRCodeModel = new QRCodeModel(qrcodeRequest.acometidaId, qrcodeRequest.imagenBytea, qrcodeRequest.qrcodeUrl);
    return qrcodeModel;
  }
}