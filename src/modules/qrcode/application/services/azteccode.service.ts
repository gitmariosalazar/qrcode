import { CodeConfig, InterfaceCodeService, ResultCode } from "../usecases/qrcode.interface";
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";
import * as bwipjs from 'bwip-js';


@Injectable()
export class AztecCodeService implements InterfaceCodeService {
  constructor() { }

  async generateQRCode(config: CodeConfig): Promise<ResultCode> {
    try {
      // Validate data
      config.type.validateData(config.data);

      // Combine data and acometidaId into a structured format
      const text = JSON.stringify({
        data: config.data,
        acometidaId: config.acometidaId,
      });

      // Prepare options for bwip-js
      const options = {
        bcid: config.type.getBcid(), // Should return 'azteccode'
        text,
        scale: config.options?.scale || 3,
        height: config.options?.height || 10,
        includetext: false,
        ...config.type.getGenerationOptions(),
      };

      // Debug logs
      console.log('bwipj:', bwipjs);
      console.log('bwipj.toBuffer:', bwipjs.toBuffer);
      console.log('Options:', options);

      // Generate Aztec code as buffer
      const buffer: Buffer = await bwipjs.toBuffer(options);

      if (buffer.length === 0) {
        throw new Error('Buffer de código vacío');
      }

      const id = uuidv4().replace(/-/g, '').substring(0, 10);
      console.log(`Código ${config.type.getBcid()} generado con ID: ${id}, Acometida ID: ${config.acometidaId}`);
      return { id, buffer, urlQRCode: '' };
    } catch (error) {
      console.error(`Error generando ${config.type.getBcid()} para Acometida ID ${config.acometidaId}:`, error);
      throw new Error(`No se pudo generar el código ${config.type.getBcid()} para Acometida ID ${config.acometidaId}`);
    }
  }
}