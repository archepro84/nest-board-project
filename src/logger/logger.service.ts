import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this);
    this.doSomething();
  }

  private doSomething() {
    this.debug('MyLogger Class doSomething');
  }
}
