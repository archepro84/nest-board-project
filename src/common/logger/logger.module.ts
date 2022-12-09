import { Logger, Module } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

const loggingInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};

@Module({
  providers: [Logger, MyLogger, loggingInterceptorProvider],
  exports: [MyLogger],
})
export class LoggerModule {}
