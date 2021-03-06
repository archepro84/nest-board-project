import { Logger, Module } from '@nestjs/common';
import { UsersController } from './interface/users.controller';
import { EmailModule } from '../../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from './users.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/command/create-user-handler';
import { UserEntity } from './infra/db/entities/user.entity';
import { UserEventsHandler } from './application/event/user-events.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { EmailService } from './infra/adapter/email.service';
import { LoginUserHandler } from './application/command/login-user.handler';
import { RemoveUserHandler } from './application/command/remove-user.handler';
import { VerifyEmailHandler } from './application/command/verify-email.handler';

const handlerRolesGuardProvider = {
  provide: APP_GUARD,
  useClass: HandlerRolesGuard,
};

const userRepositoryProvider = {
  provide: 'UserRepository',
  useClass: UserRepository,
};

const emailServiceProvider = {
  provide: 'EmailService',
  useClass: EmailService,
};

const commandHandlers = [
  CreateUserHandler,
  LoginUserHandler,
  RemoveUserHandler,
  VerifyEmailHandler,
];

const eventHandlers = [UserEventsHandler];

const queryHandlers = [GetUserInfoQueryHandler];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    handlerRolesGuardProvider,
    Logger,
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    UserFactory,
    userRepositoryProvider,
    emailServiceProvider,
  ],
})
export class UsersModule {}
