import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '@erp/shared';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'An unexpected error occurred';
    let errorCode = 'INTERNAL_ERROR';
    let errors: unknown = undefined;

    if (exception instanceof AppError) {
      status = exception.statusCode;
      title = exception.name;
      detail = exception.message;
      errorCode = exception.errorCode;
      errors = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      title = exception.name;
      if (typeof res === 'string') {
        detail = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        detail = (obj.message as string) || exception.message;
        errorCode = (obj.error as string) || 'HTTP_EXCEPTION';
        errors = obj.message;
      }
    } else if (exception instanceof Error) {
      detail = exception.message;
    }

    response.status(status).header('Content-Type', 'application/problem+json').json({
      type: `https://api.erp.local/errors/${errorCode.toLowerCase()}`,
      title,
      status,
      detail,
      errorCode,
      instance: request.url,
      timestamp: new Date().toISOString(),
      errors,
    });
  }
}
