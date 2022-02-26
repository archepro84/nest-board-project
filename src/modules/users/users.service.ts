import {
  Body,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ulid } from 'ulid';
import { EmailService } from '../../email/email.service';
import { AuthService } from '../../auth/auth.service';
import { UserInfo } from './user-info';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private authService: AuthService,
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

    await this.sendMemberJoinEmail(email, signupVerifyToken);

    await this.usersRepository.saveUserUsingTransaction(
      createUserDto,
      signupVerifyToken ? signupVerifyToken : ulid(),
    );
  }

  async createUserAdmin(createUserDto: CreateUserDto) {
    return true;
  }

  async sendMemberJoinEmail(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
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

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.getUserInfo(userId);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
