import * as uuid from 'uuid';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ulid } from 'ulid';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private connection: Connection,
    // private eventBus: EventBus,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    // const signupVerifyToken = uuid.v1();

    // await this.saveUserUsingTransaction(
    //   name,
    //   email,
    //   password,
    //   signupVerifyToken,
    // );

    // this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    // this.eventBus.publish(new TestEvent());
  }

  async saveUserUsingTransaction(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ): Promise<void> {
    // Python ContextManager
    await this.connection.transaction(async (manager) => {
      const { name, email, password } = createUserDto;
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });

    return user !== undefined;
  }
}
