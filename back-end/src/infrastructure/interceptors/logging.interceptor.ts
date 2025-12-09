import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, headers } = request;
        const xname = headers['xname'] || 'Unknown-Service';
        const uuid = headers['uuid'] || 'No-UUID';
        const documentNumber = headers['document-number'] || 'No-DocNum';

        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const response = context.switchToHttp().getResponse();
                    const statusCode = response.statusCode;
                    const delay = Date.now() - now;

                    this.logger.log(
                        `[${xname}] [${uuid}] [${documentNumber}] ${method} ${url} ${statusCode} - ${delay}ms`
                    );
                }),
            );
    }
}
