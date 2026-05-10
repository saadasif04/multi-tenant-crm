import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const traceId = randomUUID();
    req.headers['x-trace-id'] = traceId;

    res.on('finish', () => {
      const duration = Date.now() - start;

      console.log(
        `[${traceId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`,
      );
    });

    next();
  }
}
