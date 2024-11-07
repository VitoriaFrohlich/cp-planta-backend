/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.response && exception.response.data) {
      response.status(status).json({
        success: false,
        message: exception.message || 'Erro de validação',
        data: exception.response.data
      });
    } else if (
      exception instanceof Error &&
      exception.message &&
      exception.message.includes('Invalid `this.prisma')
    ) {
      const errorMessage = exception.message;

      const formattedMessage = errorMessage
        .replace(/.*Invalid `this\.prisma\.[\w.]+` invocation.*\n/g, '\n')
        .trim();

      response.status(status).json({
        success: false,
        message: formattedMessage,
        data: null
      });
    } else {
      response.status(status).json({
        success: false,
        message: exception.message || 'Erro interno do servidor',
        data: null
      });
    }
  }
}
