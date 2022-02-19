import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
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

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersRepository.verifyEmail(verifyEmailDto);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    // return this.authService.login({
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    // });
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
