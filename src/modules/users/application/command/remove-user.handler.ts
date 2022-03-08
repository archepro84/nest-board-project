import { Injectable } from '@nestjs/common';
import { RemoveUserCommand } from './remove-user.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infra/db/entities/user.entity';

@Injectable()
@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
  constructor(
    private connection: Connection,
    private eventBus: EventBus,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: RemoveUserCommand) {}
}
