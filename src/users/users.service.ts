import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { EmailService } from '../email/email.service';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ): Promise<void> {
    const { email } = createUserDto;

    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    return this.usersRepository.saveUserUsingTransaction(
      createUserDto,
      signupVerifyToken ? signupVerifyToken : ulid(),
    );
  }

  async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.checkUserExists(emailAddress);

    return user !== undefined;
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
