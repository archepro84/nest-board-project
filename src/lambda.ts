import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import * as express from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston/dist/winston.interfaces';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

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
};

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp: INestApplication = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      nestApplicationOptions,
    );

    nestApp.useGlobalPipes(new ValidationPipe());
    // nestApp.useLogger(nestApp.get(WINSTON_MODULE_NEST_PROVIDER)); // Global Logger
    // nestApp.use(mainLogger); // Global Middleware

    nestApp.use(eventContext());
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
