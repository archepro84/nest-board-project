import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import * as express from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp: INestApplication = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.useGlobalPipes(new ValidationPipe());
    nestApp.use(eventContext());
    // nestApp.useGlobalGuards(new AuthGuard()); // Global Guard
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
