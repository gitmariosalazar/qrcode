import { Module } from '@nestjs/common';
import { QRCodeModuleUsingMySQL } from '../../modules/qrcode/infrastructure/modules/mysql/mysql.qrcode.module';

@Module({
  imports: [QRCodeModuleUsingMySQL],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppQRCodeModulesUsingMySQL {}
