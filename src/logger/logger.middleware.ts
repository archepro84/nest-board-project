import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Logger.debug(req.path);
    next();
  }
}

@Injectable()
export class Logger2Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Logger.debug('Request2 ...');
    next();
  }
}

export function mainLogger(req: Request, res: Response, next: NextFunction) {
  Logger.debug('Request3 ...');
  next();
}
