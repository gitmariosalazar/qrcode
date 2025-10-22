export abstract class QRCodeFather {
  protected abstract bcid: string
  protected abstract maxBytes: number
  protected errorCorrectionsLevel: number[] = [7, 15, 25, 30];

  protected defaultOptions: Record<string, any> = {
    scale: 3,
    height: 10,
    includeText: false
  }

  getBcid(): string {
    return this.bcid;
  }

  validateData(data: string): void {
    const byteLength = Buffer.from(data, 'utf-8').length;
    if (byteLength > this.maxBytes) {
      throw new Error(
        `Datos exceden capacidad máxima de ${this.bcid} (${this.maxBytes} bytes). Actual: ${byteLength} bytes.`
      );
    }
    if (!data) {
      throw new Error('Datos no pueden estar vacíos');
    }
  }
  getGenerationOptions(): Record<string, any> {
    return { ...this.defaultOptions };
  }
}

export class QRCode extends QRCodeFather {
  protected bcid = 'qrcode';
  protected maxBytes = 2953;
  protected errorCorrectionLevels = [7, 15, 25, 30];

  getGenerationOptions(): Record<string, any> {
    return {
      ...super.getGenerationOptions(),
      eclevel: 'L',
    };
  }
}


export class AztecCode extends QRCodeFather {
  protected bcid = 'azteccode';
  protected maxBytes = 1914; // Máximo binario
  protected errorCorrectionLevels = [5, 10, 23, 36]; // Ajustable hasta 95% en configs avanzadas

  getGenerationOptions(): Record<string, any> {
    return {
      ...super.getGenerationOptions(),
      ecpercent: 23, // Default estándar para Aztec
    };
  }
}