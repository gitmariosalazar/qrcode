import { Module } from '@nestjs/common';
import { AppController } from './app/controller/app.controller';
import { AppService } from './app/service/app.service';
import { HomeModule } from './app/module/home.module';
import { AppQRCodeModulesUsingPostgreSQL } from './factory/postgresql/modules-using-postgresql.module';
import { AppQRCodeModulesUsingMySQL } from './factory/mysql/modules-using-mysql.module';
import { environments } from './settings/environments/environments';
import { DatabasePersistenceModule } from './shared/connections/database/database-persistence.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const qrcodeModules = environments.DATABASE_TYPE === 'mysql'
  ? AppQRCodeModulesUsingMySQL
  : AppQRCodeModulesUsingPostgreSQL;

@Module({
  imports: [
    HomeModule, 
    qrcodeModules,
    DatabasePersistenceModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets', 'images', 'qrcodes'),
      serveRoot: '/assets/images/qrcodes',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
