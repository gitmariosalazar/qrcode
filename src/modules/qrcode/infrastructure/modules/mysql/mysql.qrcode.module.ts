import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QRCodeController } from '../../controller/qrcode.controller';
import { environments } from '../../../../../settings/environments/environments';
import { QRCodeService } from '../../../application/services/qrcode.service';
import { AztecCodeService } from '../../../application/services/azteccode.service';
import { QRCodeUseCaseService } from '../../../application/services/qrcode.use-case.service';
import { GenerateCodeFactoryService } from '../../../application/strategies/generate.qrcode.service';
import { QRCodeMySQLPersistence } from '../../repositories/mysql/persistence/mysql.qrcode.persistence';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [
    DatabasePersistenceModule,
    ClientsModule.register([
      {
        name: environments.QRCODE_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.QRCODE_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: environments.QRCODE_KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [QRCodeController],
  providers: [
    QRCodeService,
    AztecCodeService,
    QRCodeUseCaseService,
    GenerateCodeFactoryService,
    {
      provide: 'QRCodeRepository',
      useClass: QRCodeMySQLPersistence,
    },
  ],
  exports: [],
})
export class QRCodeModuleUsingMySQL {}
