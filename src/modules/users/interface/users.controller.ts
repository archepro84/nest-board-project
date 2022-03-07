import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Scope,
  ValidationPipe,
  Headers,
  UseGuards,
  Logger,
  Inject,
  LoggerService,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from '../../../auth/auth.service';
import { UserInfo } from './user-info';
import { AuthGuard } from '../../../auth/auth.guard';
import { UserData, UserRoles } from '../../../utils/decorators/users-transform';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/create-user.command';
import { GetUserInfoQuery } from '../application/query/get-user-info.query';

@Controller({ path: 'users', scope: Scope.DEFAULT })
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @UseFilters(HttpExceptionFilter)
  @Post()
  createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    const { name, email, password } = createUserDto;

    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }

  @Post('/admin')
  @UserRoles('user')
  @UserRoles('admin')
  createUserAdmin(@Body() createUserDto: CreateUserDto) {
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
  getUserInfoQuery(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  @Delete('/:id')
  removeUser(@Param('id') userId: number) {
    return this.usersService.removeUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  getHello(@UserData('name') name: string) {
    this.logger.debug(name);
    return;
  }
}
