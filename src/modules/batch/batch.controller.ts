import { Controller, Logger, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry, private logger: Logger) {}

  @Post('/start')
  start() {
    const job = this.scheduler.getCronJob('defaultCronJob');

    job.start();
    this.logger.log('start ', job.lastDate());
  }

  @Post('/stop')
  stop() {
    const job = this.scheduler.getCronJob('defaultCronJob');

    job.stop();
    this.logger.log('stop ', job.lastDate());
  }
}
