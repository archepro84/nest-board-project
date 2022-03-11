import { Injectable, NotFoundException } from '@nestjs/common';
import { VerifyEmailDto } from './interface/dto/verify-email.dto';
import { UserLoginDto } from './interface/dto/user-login.dto';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../common/email/email.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  async sendMemberJoinEmail(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersRepository.verifyEmail(verifyEmailDto);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const user = await this.usersRepository.login(userLoginDto);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
