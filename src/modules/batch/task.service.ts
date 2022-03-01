import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  addCronJob() {
    const name = 'defaultCronJob';
    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }

  // @Cron('* * * * * *', { name: 'cronTask' })
  // handleCron() {
  //   this.logger.log('Task Call');
  // }
  //
  // @Cron(new Date(Date.now() + 60 * 1000))
  // handleCronDate() {
  //   this.logger.log('Task called by cron date');
  // }
  //
  // @Cron(CronExpression.EVERY_DAY_AT_8AM)
  // handleCronExpression() {
  //   this.logger.log('Task called by cron expression');
  // }
  //
  // @Interval('intervalTask', 3000)
  // handleInterval() {
  //   this.logger.log('Task called by interval');
  // }
  //
  // @Timeout('timeoutTask', 5000)
  // handleTimeout() {
  //   this.logger.log('Task called by timeout');
  // }
}
