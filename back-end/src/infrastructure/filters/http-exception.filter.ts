
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { StandardResponse } from '../../domain/interfaces/IStandarsResponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        const errorMessage = typeof message === 'object' && (message as any).message
            ? (message as any).message
            : message;

        const responseBody: StandardResponse = {
            statusCode: status,
            success: false,
            message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage as string,
            data: null,
        };

        response.status(status).json(responseBody);
    }
}
