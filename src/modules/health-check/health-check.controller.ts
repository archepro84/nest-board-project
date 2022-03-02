import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AnimalHealthIndicator } from './animal.check';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private animalHealthIndicator: AnimalHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('/db')
  @HealthCheck()
  dbCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('/animal')
  @HealthCheck()
  animalCheck() {
    return this.health.check([
      () => this.animalHealthIndicator.isHealthy('animal'),
    ]);
  }
}
