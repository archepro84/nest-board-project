import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../common/email/email.service';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async sendMemberJoinEmail(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
