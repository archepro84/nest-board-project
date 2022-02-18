import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { mainLogger } from './logger/logger.middleware';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(mainLogger);
  await app.listen(3000);
}

bootstrap();
