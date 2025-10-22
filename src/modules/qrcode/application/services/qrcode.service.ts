import { CodeConfig, InterfaceCodeService, ResultCode } from "../usecases/qrcode.interface";
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { Injectable } from "@nestjs/common";
import * as fs from 'fs/promises';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';
const sharp = require('sharp');

@Injectable()
export class QRCodeService implements InterfaceCodeService {
  private readonly outputDir = '/home/sigepaa/sigepaa/images/qrcodes';
  private readonly baseUrl = 'https://sigepaa-aa.com:8443';

  constructor() {
    console.log('Output directory:', this.outputDir);
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
      throw new Error('Failed to create QR code storage directory');
    }
  }

  async generateQRCode(config: CodeConfig): Promise<ResultCode & { filePath?: string; downloadURL?: string }> {
    try {
      config.type.validateData(config.data);

      const qrData = JSON.stringify({ acometidaId: config.acometidaId });
      const logoDefault = path.join(__dirname, '..', '..', '..', '..', '..', 'assets', 'images', 'epaa.png');

      const {
        margin = 4,
        size = 600,
        scale = 10,
        logoPath = logoDefault,
        logoScale = 0.10,
        title = config.acometidaId,
        titleFontSize = 12,
        titleColor = '#000000',
        qrColorDark = '#000000FF',
        qrColorLight = '#ffffff',
      } = config.options || {};

      const qrBuffer = await QRCode.toBuffer(qrData, {
        errorCorrectionLevel: 'H',
        type: 'png',
        margin,
        scale,
        color: { dark: qrColorDark, light: qrColorLight },
      });

      if (qrBuffer.length === 0) {
        throw new Error('Buffer code is empty!');
      }

      let qrImage = sharp(qrBuffer).resize(size, size, {
        fit: 'contain',
        background: qrColorLight,
        kernel: 'nearest',
      });

      const qrMetadata = await qrImage.metadata();
      const qrWidth = qrMetadata.width || size;
      let titleHeight = title ? titleFontSize + 10 : 0;
      const finalHeight = qrWidth + titleHeight;

      const canvas = createCanvas(qrWidth, finalHeight);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      ctx.fillStyle = qrColorLight;
      ctx.fillRect(0, 0, qrWidth, finalHeight);

      const qrImageBufferFinal = await qrImage.png().toBuffer();
      const qrImageCanvas = await loadImage(qrImageBufferFinal);
      ctx.drawImage(qrImageCanvas, 0, 0, qrWidth, qrWidth);

      if (logoPath) {
        try {
          const logoMetadata = await sharp(logoPath).metadata();
          if (logoMetadata.width < 1000 || logoMetadata.height < 1000) {
            console.warn('Icon resolution is low (<1000x1000). Consider using a higher resolution image.');
          }

          const logoBuffer = await sharp(logoPath)
            .resize(Math.floor(qrWidth * logoScale), undefined, {
              fit: 'contain',
              kernel: 'lanczos3',
              withoutEnlargement: true,
            })
            .png({ force: true, quality: 100, compressionLevel: 0 })
            .flatten({ background: '#ffffff' })
            .toBuffer();

          const logoImage = await loadImage(logoBuffer);
          const logoWidth = logoImage.width;
          const logoHeight = logoImage.height;

          const marginLogo = 4;
          const boxRadius = Math.max(logoWidth, logoHeight) * 0.6 + marginLogo;
          const boxCenterX = qrWidth / 2;
          const boxCenterY = qrWidth / 2;

          ctx.beginPath();
          ctx.arc(boxCenterX, boxCenterY, boxRadius, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#222222';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.imageSmoothingEnabled = false;
          const logoX = boxCenterX - logoWidth / 2;
          const logoY = boxCenterY - logoHeight / 2;
          ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
          ctx.imageSmoothingEnabled = true;
        } catch (err) {
          console.warn('Error loading icon:', err);
        }
      }

      if (title) {
        const textPadding = 1;
        const titleHeight = titleFontSize + textPadding * 2;
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, qrWidth, qrWidth, titleHeight);

        ctx.fillStyle = '#000000';
        ctx.font = `bold ${titleFontSize}px Arial, Helvetica, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.imageSmoothingEnabled = true;
        ctx.fillText(title, qrWidth / 2, qrWidth + titleHeight / 2);
        ctx.imageSmoothingEnabled = false;
      }

      const finalBuffer = await sharp(canvas.toBuffer('image/png'))
        .png({ compressionLevel: 0, quality: 100 })
        .toBuffer();

      const id = uuidv4().replace(/-/g, '').substring(0, 10);
      const safeFileName = `QRCode_CC_${config.acometidaId.replace(/[^a-zA-Z0-9-]/g, '_')}.png`;
      const filePath = path.join(this.outputDir, safeFileName);
      await sharp(finalBuffer)
        .png({ compressionLevel: 0, quality: 100 })
        .toFile(filePath);
      console.log('Here is your image:', filePath);

      const downloadURL = `${this.baseUrl}/images/qrcodes/${safeFileName}`;

      console.log(`Code ${config.type.getBcid()} generated with ID: ${id}, Acometida ID: ${config.acometidaId}, Saved in: ${filePath}, URL: ${downloadURL}`);

      return { id, buffer: finalBuffer, filePath, downloadURL, urlQRCode: downloadURL };
    } catch (error) {
      console.error(`Error generating ${config.type.getBcid()} for Acometida ID ${config.acometidaId}:`, error);
      throw new Error(`Failed to generate code ${config.type.getBcid()} for Acometida ID ${config.acometidaId}`);
    }
  }
}