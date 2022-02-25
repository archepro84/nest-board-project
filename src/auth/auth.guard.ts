import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = this.validateRequest(request);

    return true;
  }

  private validateRequest(request: Request): Object {
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    return this.authService.verify(jwtString);
  }
}
