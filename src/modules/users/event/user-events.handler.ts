import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { TestEvent } from './test.event';
import { EmailService } from '../../../common/email/email.service';
import { Logger } from '@nestjs/common';

@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler
  implements IEventHandler<UserCreatedEvent | TestEvent>
{
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name:
        Logger.debug(`UserCreatedEvent handle from UserEventsHandler`);
        const { email, signupVerifyToken } = event as UserCreatedEvent;

        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      case TestEvent.name:
        Logger.debug(`TestEvent handle from UserEventsHandler`);
        break;
      default:
        break;
    }
  }
}
