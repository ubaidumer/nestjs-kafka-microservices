import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Exception filter for all unsuccessfull responses with a json body in response
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errMessage =
      exception.getResponse() instanceof Object
        ? exception.getResponse()['message']
        : exception.getResponse();

    response.status(status).json({
      message: errMessage,
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      isSuccess: false,
    });
  }
}
