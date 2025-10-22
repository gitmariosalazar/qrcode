import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "src/settings/environments/environments";
import { QRCodeController } from "../../controller/qrcode.controller";
import { DatabaseServicePostgreSQL } from "src/shared/connections/database/postgresql/postgresql.service";
import { QRCodeUseCaseService } from "src/modules/qrcode/application/services/qrcode.use-case.service";
import { QRCodePostgreSQLPersistence } from "../../repositories/postgresql/persistence/qrcode.persistence";
import { GenerateCodeFactoryService } from "src/modules/qrcode/application/strategies/generate.qrcode.service";
import { QRCodeService } from "src/modules/qrcode/application/services/qrcode.service";
import { AztecCodeService } from "src/modules/qrcode/application/services/azteccode.service";

@Module({
  imports: [ClientsModule.register([
    {
      name: environments.QRCODE_KAFKA_CLIENT,
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: environments.QRCODE_KAFKA_CLIENT_ID,
          brokers: [environments.KAFKA_BROKER_URL]
        },
        consumer: {
          groupId: environments.QRCODE_KAFKA_GROUP_ID
        }
      }
    }
  ]),
  ],
  controllers: [QRCodeController],
  providers: [
    DatabaseServicePostgreSQL,
    QRCodeService,
    AztecCodeService,
    QRCodeUseCaseService,
    GenerateCodeFactoryService,
    {
      provide: 'QRCodeRepository',
      useClass: QRCodePostgreSQLPersistence
    }
  ],
  exports: []
})
export class QRCodeModuleUsingPostgreSQL { }