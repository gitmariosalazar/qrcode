import { Injectable } from "@nestjs/common";
import { QRCodeSQLResult } from "../../../interfaces/sql/qrcode.interface";
import { RpcException } from "@nestjs/microservices";
import { QRCodeAdapter } from "../adapters/qrcode.adapter";
import { InterfaceQRcodeRepository } from "../../../../domain/contracts/qrcode.interface.repository";
import { DatabaseServicePostgreSQL } from "../../../../../../shared/connections/database/postgresql/postgresql.service";
import { QRCodeModel } from "../../../../domain/schemas/model/qrcode.model";
import { QRCodeResponse } from "../../../../domain/schemas/dto/response/qrcode.response";
import { statusCode } from "../../../../../../settings/environments/status-code";

@Injectable()
export class QRCodePostgreSQLPersistence implements InterfaceQRcodeRepository {
  constructor(
    private readonly postgresqlService: DatabaseServicePostgreSQL
  ) { }

  async verifyIfExistQRCodeByAcmetidaId(acometidaId: string): Promise<boolean> {
    try {
      const query: string = `SELECT  q.qrcodeId, q.acometidaId FROM qrcode q WHERE acometidaId = $1;`
      const params: string[] = [acometidaId];
      const result = await this.postgresqlService.query(query, params);
      return result.length === 1;
    } catch (error) {
      throw error;
    }
  }

  async findAcometidaById(acometidaId: string): Promise<boolean> {
    try {
      const queryAcometidaFound: string = `
        SELECT a.acometidaid FROM acometida a WHERE a.acometidaid = $1;
      `;

      const paramFound: string[] = [acometidaId];

      const resultFound = await this.postgresqlService.query(queryAcometidaFound, paramFound);
      return resultFound.length === 1;
    } catch (error) {
      throw error
    }
  }

  async createQRcode(qrcodeModel: QRCodeModel): Promise<QRCodeResponse | null> {
    try {



      const query: string = `
        INSERT INTO qrcode (acometidaId, imagenBytea, qrcodeUrl)
        VALUES ($1, $2, $3)
        RETURNING qrcodeId AS "qrcodeId", acometidaId AS "acometidaId", imagenBytea AS "imagenBytea", qrcodeUrl AS "qrcodeUrl", createdAt AS "createdAt", updatedAt AS "updatedAt";
      `;

      const params = [
        qrcodeModel.getAcometidaId(),
        qrcodeModel.getImagenBytea(),
        qrcodeModel.getQrcodeUrl(),
      ];

      const result = await this.postgresqlService.query<QRCodeSQLResult>(query, params);

      if (result.length === 0) {
        return null;
      }

      const response: QRCodeResponse = QRCodeAdapter.fromQRCodeSQLResultToQRCodeResponse(result[0])
      return response
    } catch (error) {
      throw error
    }
  }

  async findQRCodeByAcometidaId(acometidaId: string): Promise<QRCodeResponse | null> {
    try {
      const query: string = `
        SELECT  q.qrcodeId AS "qrcodeId", q.acometidaId AS "acometidaId", q.imagenBytea AS "imagenBytea", q.createdAt AS "createdAt" FROM qrcode q WHERE acometidaId = $1
      `;
      const params = [acometidaId]

      const result = await this.postgresqlService.query<QRCodeSQLResult>(query, params);

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `QR Code with acometida ID ${acometidaId} not found`
        });
      }

      const qrcodeResponse: QRCodeResponse = QRCodeAdapter.fromQRCodeSQLResultToQRCodeResponse(result[0]);
      return qrcodeResponse;

    } catch (error) {
      throw error
    }
  }
}