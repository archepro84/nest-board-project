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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller({ path: 'users', scope: Scope.DEFAULT })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }

  @Post(`/email-verify`)
  verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    return this.usersService.verifyEmail(dto);
  }

  @Post('/login')
  login(@Body() dto: UserLoginDto): Promise<string> {
    return this.usersService.login(dto);
  }

  @Get('/:id')
  getUserInfo(@Param('id', ParseIntPipe) userId: number): Promise<string> {
    return this.usersService.getUserInfo(userId);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.removeUser(userId);
  }
}
