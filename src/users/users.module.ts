import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
