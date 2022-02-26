import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
const customExceptionFilters = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

@Module({
  providers: [Logger, customExceptionFilters],
})
export class ExceptionModule {}
