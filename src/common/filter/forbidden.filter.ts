import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: '권한이 없습니다.',
      path: request.path,
      time: new Date().toISOString(),
    });
  }
}
