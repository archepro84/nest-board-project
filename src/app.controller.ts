import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }
  @Get('/db-host-from-config')
  getDatabaseHostFromConfigService(): Promise<string> {
    return this.appService.getDatabaseHostFromConfigService();
  }
}
