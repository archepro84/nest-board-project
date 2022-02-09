import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info';

@Injectable()
export class UsersService {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { name, email, password } = createUserDto;

    Logger.debug(
      `This action adds a new user, 
      name: ${name}, email: ${email}, password: ${password}`,
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;
    Logger.debug(`${signupVerifyToken}`);
    return;
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDto;

    Logger.debug(`${email}, ${password}`);
    return;
  }

  async getUserInfo(userId: string): Promise<string> {
    Logger.debug(`${userId}`);
    return;
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
