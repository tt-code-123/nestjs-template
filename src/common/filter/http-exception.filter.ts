import {
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Catch,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // tslint:disable-next-line: no-console
      console.error(exception);
    }
    const res: any = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      error:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? (res.message ?? (exception.message || null))
          : 'Internal server error',
    };

    switch (host.getType() as string) {
      case 'http': {
        // This is for REST petitions
        const httpError = {
          ...errorResponse,
          path: request.url,
          method: request.method,
        };

        Logger.error(
          `${request.method} ${request.url}`,
          JSON.stringify(httpError),
          'ExceptionFilter',
        );

        response.status(status).json(errorResponse);
        break;
      }
    }
  }
}
