import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/user-created.event';
import { EmailService } from '../../../../email/email.service';
import { Logger } from '@nestjs/common';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name:
        Logger.debug(`UserCreatedEvent handle from UserEventsHandler`);
        const { email, signupVerifyToken } = event as UserCreatedEvent;

        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      default:
        break;
    }
  }
}
