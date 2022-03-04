import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../../common/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from './users.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user-handler';
import { UserEntity } from './entities/user.entity';
import { UserEventsHandler } from './event/user-events.handler';

const handlerRolesGuardProvider = {
  provide: APP_GUARD,
  useClass: HandlerRolesGuard,
};

const commandHandlers = [CreateUserHandler];

const eventHandlers = [UserEventsHandler];

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UsersRepository, UserEntity]),
    AuthModule,
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    handlerRolesGuardProvider,
    Logger,
    ...commandHandlers,
    ...eventHandlers,
  ],
})
export class UsersModule {}
