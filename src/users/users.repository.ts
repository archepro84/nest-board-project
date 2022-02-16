import { Connection, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ulid } from 'ulid';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  constructor(private connection: Connection) {
    super();
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

  async checkUserExists(emailAddress: string): Promise<UserEntity> {
    const user = await this.findOne({ email: emailAddress });

    return user;
  }
}
