import { Injectable } from '@nestjs/common';
import { QRCodeSQLResult } from '../../../interfaces/sql/qrcode.interface';
import { RpcException } from '@nestjs/microservices';
import { QRCodeAdapter } from '../adapters/qrcode.adapter';
import { InterfaceQRcodeRepository } from '../../../../domain/contracts/qrcode.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { QRCodeModel } from '../../../../domain/schemas/model/qrcode.model';
import { QRCodeResponse } from '../../../../domain/schemas/dto/response/qrcode.response';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class QRCodePostgreSQLPersistence implements InterfaceQRcodeRepository {
  constructor(private readonly postgresqlService: DatabaseServicePostgreSQL) {}

  async verifyIfExistQRCodeByAcmetidaId(acometidaId: string): Promise<boolean> {
    try {
      const query: string = `SELECT  q.qrcode_id, q.acometida_id FROM qrcode q WHERE acometida_id = $1;`;
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
        SELECT a.acometida_id FROM acometida a WHERE a.acometida_id = $1;
      `;

      const paramFound: string[] = [acometidaId];

      const resultFound = await this.postgresqlService.query(
        queryAcometidaFound,
        paramFound,
      );
      return resultFound.length === 1;
    } catch (error) {
      throw error;
    }
  }

  async createQRcode(qrcodeModel: QRCodeModel): Promise<QRCodeResponse | null> {
    try {
      const query: string = `
        INSERT INTO qrcode (acometida_id, imagen_bytea, qrcode_url)
        VALUES ($1, $2, $3)
        RETURNING qrcode_id AS "qrcodeId", acometida_id AS "acometidaId", imagen_bytea AS "imagenBytea", qrcode_url AS "qrcodeUrl", created_at AS "createdAt", updated_at AS "updatedAt";
      `;

      const params = [
        qrcodeModel.getAcometidaId(),
        qrcodeModel.getImagenBytea(),
        qrcodeModel.getQrcodeUrl(),
      ];

      const result = await this.postgresqlService.query<QRCodeSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        return null;
      }

      const response: QRCodeResponse =
        QRCodeAdapter.fromQRCodeSQLResultToQRCodeResponse(result[0]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findQRCodeByAcometidaId(
    acometidaId: string,
  ): Promise<QRCodeResponse | null> {
    try {
      const query: string = `
        SELECT  q.qrcode_id AS "qrcodeId", q.acometida_id AS "acometidaId", q.imagen_bytea AS "imagenBytea", q.created_at AS "createdAt" FROM qrcode q WHERE acometida_id = $1
      `;
      const params = [acometidaId];

      const result = await this.postgresqlService.query<QRCodeSQLResult>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `QR Code with acometida ID ${acometidaId} not found`,
        });
      }

      const qrcodeResponse: QRCodeResponse =
        QRCodeAdapter.fromQRCodeSQLResultToQRCodeResponse(result[0]);
      return qrcodeResponse;
    } catch (error) {
      throw error;
    }
  }
}
