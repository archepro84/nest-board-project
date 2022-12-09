import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from './common/logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly myLogger: MyLogger,
  ) {}

  async getHello(): Promise<string> {
    this.myLogger.debug('debug');
    this.myLogger.error('error');
    return process.env.DATABASE_HOST;
  }

  async getDatabaseHostFromConfigService(): Promise<string> {
    return this.configService.get('DATABASE_HOST');
  }
}
