import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getHello(): Promise<string> {
    return process.env.DATABASE_HOST;
  }

  async getDatabaseHostFromConfigService(): Promise<string> {
    return this.configService.get('DATABASE_HOST');
  }
}
