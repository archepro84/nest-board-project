import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { name, email, password } = createUserDto;

    Logger.debug(
      `This action adds a new user, 
      name: ${name}, email: ${email}, password: ${password}`,
    );

    // await this.checkUserExists(email);
    //
    // const signupVerifyToken = uuid.v1();
    //
    // await this.saveUser(createUserDto, signupVerifyToken);
    // await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async checkUserExists(email: string) {
    return false;
  }

  async saveUser(createUserDto: CreateUserDto, signupVerifyToken: string) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;

    Logger.debug(`${signupVerifyToken}`);
    throw new Error('Method·not·implemented.');
    return;
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDto;

    Logger.debug(`${email}, ${password}`);
    throw new Error('Method·not·implemented.');
    return;
  }

  async getUserInfo(userId: number): Promise<string> {
    Logger.debug(`${userId}`);
    throw new Error('Method·not·implemented.');
    return;
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
