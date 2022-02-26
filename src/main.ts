import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import * as winston from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston/dist/winston.interfaces';

const winstonModuleOption: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV == 'production' ? 'info' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('nest-board-app', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
};

const nestApplicationOptions: NestApplicationOptions = {
  logger: WinstonModule.createLogger(winstonModuleOption),
  // process.env.NODE_ENV == 'production'
  //   ? ['error', 'warn', 'log']
  //   : ['error', 'warn', 'log', 'verbose', 'debug'],
};

async function bootstrap() {
  const nestApp: INestApplication = await NestFactory.create(
    AppModule,
    nestApplicationOptions,
  );
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // nestApp.useLogger(nestApp.get(WINSTON_MODULE_NEST_PROVIDER)); // Global Logger
  // nestApp.use(mainLogger); // Global Middleware
  await nestApp.listen(3000);
}

bootstrap();
