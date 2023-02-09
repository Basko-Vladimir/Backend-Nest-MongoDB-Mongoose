import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

// @Catch()
// export class ServerErrorsExceptionsFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const errorStatus = exception.getStatus();
//     const errorResponseBody: any = exception.getResponse();
//
//     response.send(exception);
//   }
// }

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorStatus = exception.getStatus();
    const errorResponseBody: any = exception.getResponse();

    if (errorStatus === 400) {
      const result = { errorsMessages: errorResponseBody.message };
      response.status(errorStatus).send(result);
    }

    response.status(errorStatus).json({
      statusCode: errorStatus,
      message: errorResponseBody.message,
    });
  }
}
