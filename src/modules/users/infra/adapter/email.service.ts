import { IEmailService } from '../../application/adapter/iemail.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  constructor(@Inject('EmailService') private emailService: IEmailService) {}

  async sendMemberJoinVerification(email, signupVerifyToken): Promise<void> {
    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
