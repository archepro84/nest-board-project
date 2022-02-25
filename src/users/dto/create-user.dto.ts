import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import {
  createUserNameTransform,
  NotIn,
} from 'src/utils/decorators/users-transform';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Transform(createUserNameTransform)
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[a-zA-Z\d!@#$%^&*()]{8,35}$/, {
    message: `패스워드 형식에 일치하지 않습니다.`,
  })
  readonly password: string;
}
