import { QRCode } from '../../domain/schemas/model/qrcode';
import { InterfaceQrCodeUseCase } from '../usecases/qrcode.use-case.interface';
import { CreateQRCodeRequest } from '../../domain/schemas/dto/request/create.qrcode.request';
import { QRCodeResponse } from '../../domain/schemas/dto/response/qrcode.response';
import { GenerateCodeFactoryService } from '../strategies/generate.qrcode.service';
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceQRcodeRepository } from '../../domain/contracts/qrcode.interface.repository';
import { QRCodeModel } from '../../domain/schemas/model/qrcode.model';
import { QRCodeMapper } from '../mappers/qrcode.mappers';
import { ResultCode } from '../usecases/qrcode.interface';
import { RpcException } from '@nestjs/microservices';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../settings/environments/status-code';

@Injectable()
export class QRCodeUseCaseService implements InterfaceQrCodeUseCase {
  constructor(
    private readonly factoryQRCodeService: GenerateCodeFactoryService,
    @Inject('QRCodeRepository')
    private readonly qrcodeRepository: InterfaceQRcodeRepository,
  ) { }

  async verifyIfExistQRCodeByAcmetidaId(acometidaId: string): Promise<boolean> {
    return this.qrcodeRepository.verifyIfExistQRCodeByAcmetidaId(acometidaId);
  }

  async findAcometidaById(acometidaId: string): Promise<boolean> {
    return this.qrcodeRepository.findAcometidaById(acometidaId);
  }

  async createQRcode(
    qrcodeRequest: CreateQRCodeRequest,
  ): Promise<QRCodeResponse | null> {
    try {

      const requiredFields: string[] = ['acometidaId'];
      const missingFieldMessages: string[] = validateFields(qrcodeRequest, requiredFields);

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages
        })
      }

      const existAcometida: boolean = await this.findAcometidaById(qrcodeRequest.acometidaId);

      if (existAcometida === false) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Acometida with ID ${qrcodeRequest.acometidaId} not found!`
        })
      }

      const verifyQRCode: boolean = await this.verifyIfExistQRCodeByAcmetidaId(qrcodeRequest.acometidaId);

      if (verifyQRCode === true) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `QR Code for Acometida with ID ${qrcodeRequest.acometidaId} already exist on database!`
        })
      }

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages
        })
      }
      const qrCode: QRCode = new QRCode();
      const codeResponse: ResultCode | null =
        await this.factoryQRCodeService.generateCode(qrcodeRequest, qrCode);
      if (codeResponse !== null) {
        qrcodeRequest.imagenBytea = codeResponse.buffer
        qrcodeRequest.qrcodeUrl = codeResponse.urlQRCode
        const qrcodeModel: QRCodeModel =
          QRCodeMapper.fromCreateQRCodeRequestToQRCodeModel(qrcodeRequest);
        const response: QRCodeResponse | null =
          await this.qrcodeRepository.createQRcode(qrcodeModel);
        return response;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async findQRCodeByAcometidaId(
    acometidaId: string,
  ): Promise<QRCodeResponse | null> {
    try {
      const response: QRCodeResponse | null = await this.qrcodeRepository.findQRCodeByAcometidaId(acometidaId);
      if (response !== null) {
        return response
      } else {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `QR Code with acometidaId: ${acometidaId} not found!`
        })
      }
    } catch (error) {
      throw error
    }
  }
}
