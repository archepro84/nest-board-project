import { VerifyEmailCommand } from './verify-email.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infra/db/repository/user.repository';
import { AuthService } from '../../../../auth/auth.service';

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { signupVerifyToken } = command;

    const user = await this.userRepository.verifyEmail(signupVerifyToken);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
