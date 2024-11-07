/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    let message = 'Operação realizada com sucesso';

    if (method === 'POST') {
      message = 'Recurso criado com sucesso';
    } else if (method === 'PATCH') {
      message = 'Recurso atualizado com sucesso';
    }

    return next.handle().pipe(
      map(data => {
        return {
          sucess: true,
          message: message,
          data: data
        };
      })
    );
  }
}
