import { Module } from "@nestjs/common";
import { QRCodeModuleUsingPostgreSQL } from "src/modules/qrcode/infrastructure/modules/postgresql/postgresql.qrcode.module";

@Module({
  imports: [QRCodeModuleUsingPostgreSQL],
  controllers: [],
  providers: [],
  exports: []
})
export class AppQRCodeModulesUsingPostgreSQL { }