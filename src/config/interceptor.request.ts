/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestMethodPathInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Adiciona o método e o caminho ao corpo da requisição
    request.body = {
      ...request.body,
      __method: request.method.toUpperCase(),
      __path: request.url.split('?')[0] // Remove query string
    };

    return next.handle().pipe(map(data => data));
  }
}
