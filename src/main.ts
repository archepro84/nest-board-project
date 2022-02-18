import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { mainLogger } from './logger/logger.middleware';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // app.use(mainLogger); // Global Middleware
  // app.useGlobalGuards(new AuthGuard()); // Global Guard
  await app.listen(3000);
}

bootstrap();
