import { Controller, Get, Post } from "@nestjs/common";
import { QRCodeUseCaseService } from "../../application/services/qrcode.use-case.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateQRCodeRequest } from "../../domain/schemas/dto/request/create.qrcode.request";

@Controller('QRCode')
export class QRCodeController {
  constructor(
    private readonly qrcodeService: QRCodeUseCaseService
  ) { }

  @Post('create-qrcode')
  @MessagePattern('qrcode.create')
  async createQRCode(@Payload() qrcodeRequest: CreateQRCodeRequest) {
    return this.qrcodeService.createQRcode(qrcodeRequest);
  }

  @Get('find-qrcode/:acometidaId')
  @MessagePattern('qrcode.find-qrcode-by-acometidaId')
  async findQRCodeByAcometidaId(@Payload() acometidaId: string) {
    return this.qrcodeService.findQRCodeByAcometidaId(acometidaId);
  }

}