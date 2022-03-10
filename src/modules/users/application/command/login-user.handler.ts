import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { UserRepository } from '../../infra/db/repository/user.repository';
import { AuthService } from '../../../../auth/auth.service';

@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: LoginUserCommand): Promise<any> {
    const { email, password } = command;

    const user = await this.userRepository.login(email, password);

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
