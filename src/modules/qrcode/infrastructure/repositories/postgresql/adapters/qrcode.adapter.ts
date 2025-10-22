import { QRCodeResponse } from '../../../../domain/schemas/dto/response/qrcode.response';
import { QRCodeSQLResult } from '../../../interfaces/sql/qrcode.interface';
export class QRCodeAdapter {
  static fromQRCodeSQLResultToQRCodeResponse(qrcodeSQLResult: QRCodeSQLResult): QRCodeResponse {
    const qrCodeResponse: QRCodeResponse = {
      qrcodeId: qrcodeSQLResult.qrcodeId,
      acometidaId: qrcodeSQLResult.acometidaId,
      urlQRCode: qrcodeSQLResult.qrcodeUrl,
      createdAt: qrcodeSQLResult.createdAt
    }
    return qrCodeResponse
  }
}