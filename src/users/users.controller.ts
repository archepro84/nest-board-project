import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Scope,
  ParseIntPipe,
  ValidationPipe,
  Headers,
  UseGuards,
  Logger,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from '../auth/auth.service';
import { UserInfo } from './user-info';
import { AuthGuard } from '../auth/auth.guard';
import { User, UserData } from '../utils/decorators/users-transform';

interface User {
  name: string;
  email: string;
}

@Controller({ path: 'users', scope: Scope.DEFAULT })
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.usersService.createUser(createUserDto, null);
  }

  @Post(`/email-verify`)
  verifyEmail(@Query() dto: VerifyEmailDto) {
    return this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  login(@Body() dto: UserLoginDto): Promise<string> {
    return this.usersService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }

  @Delete('/:id')
  removeUser(@Param('id') userId: number) {
    return this.usersService.removeUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  getHello(@UserData('name') name: string) {
    Logger.debug(name);
  }
}
