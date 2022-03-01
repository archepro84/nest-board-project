import {
  HttpException,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import emailConfig from './config/emailConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Logger2Middleware,
  LoggerMiddleware,
} from './common/logger/logger.middleware';
import { UsersController } from './modules/users/users.controller';
import { LoggerModule } from './common/logger/logger.module';
import authConfig from './config/authConfig';
import { ExceptionModule } from './exception/exception.module';
import { BatchModule } from './batch/batch.module';

const configModuleOption: ConfigModuleOptions = {
  envFilePath: [
    `${__dirname}/config/env/.${
      process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    }.env`,
  ],
  load: [emailConfig, authConfig],
  isGlobal: true,
  validationSchema,
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    TypeOrmModule.forRoot(),
    UsersModule,
    LoggerModule,
    ExceptionModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      .exclude({ path: 'users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
