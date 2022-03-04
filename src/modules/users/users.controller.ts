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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from '../../auth/auth.service';
import { UserInfo } from './user-info';
import { AuthGuard } from '../../auth/auth.guard';
import { UserData, UserRoles } from '../../utils/decorators/users-transform';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ErrorsInterceptor } from '../../common/interceptors/errors.interceptor';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { GetUserInfoQuery } from './query/get-user-info.query';

interface User {
  name: string;
  email: string;
}

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
    // return this.usersService.createUser(createUserDto, null);
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
  @Get('/query/:id')
  getUserInfoQuery(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(AuthGuard)
  @Get('/:id')
  getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    // throw new InternalServerErrorException();
    return this.usersService.getUserInfo(userId);
  }

  @Delete('/:id')
  removeUser(@Param('id') userId: number) {
    return this.usersService.removeUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  getHello(@UserData('name') name: string) {
    this.logger.debug(name);
  }
}
