import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QRCodeController } from "../../controller/qrcode.controller";
import { QRCodePostgreSQLPersistence } from "../../repositories/postgresql/persistence/qrcode.persistence";
import { environments } from "../../../../../settings/environments/environments";
import { DatabaseServicePostgreSQL } from "../../../../../shared/connections/database/postgresql/postgresql.service";
import { QRCodeService } from "../../../application/services/qrcode.service";
import { AztecCodeService } from "../../../application/services/azteccode.service";
import { QRCodeUseCaseService } from "../../../application/services/qrcode.use-case.service";
import { GenerateCodeFactoryService } from "../../../application/strategies/generate.qrcode.service";

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