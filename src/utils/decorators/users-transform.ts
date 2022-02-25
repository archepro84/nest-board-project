import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
  SetMetadata,
} from '@nestjs/common';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}

export function createUserNameTransform(params) {
  const { value, obj } = params;
  if (obj.password.includes(value.trim())) {
    throw new BadRequestException(
      'password는 name과 같은 문자열을 포함할 수 없습니다.',
    );
  }
  return value.trim();
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

export const UserData = createParamDecorator<string>(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export const UserRoles = (...roles: string[]) => SetMetadata('roles', roles);
