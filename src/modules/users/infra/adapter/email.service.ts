import { IEmailService } from '../../application/adapter/iemail.service';
import { EmailService as ExternalEmailService } from 'src/email/email.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  constructor(private emailService: ExternalEmailService) {}

  async sendMemberJoinVerification(email, signupVerifyToken): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
