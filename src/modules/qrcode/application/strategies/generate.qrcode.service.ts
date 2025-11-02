import { CreateQRCodeRequest } from "../../domain/schemas/dto/request/create.qrcode.request";
import { QRCodeFather, QRCode, AztecCode } from "../../domain/schemas/model/qrcode";
import { QRCodeService } from "../services/qrcode.service";
import { AztecCodeService } from "../services/azteccode.service";
import { CodeConfig, ResultCode } from "../usecases/qrcode.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateCodeFactoryService {
  constructor(
    private readonly qrcodeService: QRCodeService,
    private readonly aztecCodeService: AztecCodeService
  ) { }

  async generateCode(
    qrcodeRequest: CreateQRCodeRequest,
    type: QRCodeFather
  ): Promise<ResultCode> {
    const codeConfig: CodeConfig = {
      type,
      data: qrcodeRequest.acometidaId,
      acometidaId: qrcodeRequest.acometidaId,
      options: {
        ...type.getGenerationOptions(),
      },
    };

    let result: ResultCode;

    if (type instanceof QRCode) {
      result = await this.qrcodeService.generateQRCode(codeConfig);
    } else if (type instanceof AztecCode) {
      result = await this.aztecCodeService.generateQRCode(codeConfig);
    } else {
      throw new Error(`Code type unsupported: ${type.getBcid()}`);
    }

    return {
      id: codeConfig.acometidaId,
      buffer: result.buffer,
      urlQRCode: result.urlQRCode,
    };
  }
}
