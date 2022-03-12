import { Logger, Module } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';

const loggingInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggerInterceptor,
};

@Module({
  providers: [Logger, MyLogger, loggingInterceptorProvider],
  exports: [MyLogger],
})
export class LoggerModule {}
