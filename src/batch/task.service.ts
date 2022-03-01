import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Task Call');
  }

  @Cron(new Date(Date.now() + 3 * 1000))
  handleCronDate() {
    this.logger.log('Task called by cron date');
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  handleCronExpression() {
    this.logger.log('Task called by cron expression');
  }

  @Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('Task called by interval');
  }

  @Timeout('timeoutTask', 5000)
  handleTimeout() {
    this.logger.log('Task called by timeout');
  }
}
