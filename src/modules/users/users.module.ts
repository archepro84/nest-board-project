import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { HandlerRolesGuard } from './users.guard';

const handlerRolesGuardProvider = {
  provide: APP_GUARD,
  useClass: HandlerRolesGuard,
};

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UsersRepository]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, handlerRolesGuardProvider, Logger],
})
export class UsersModule {}
