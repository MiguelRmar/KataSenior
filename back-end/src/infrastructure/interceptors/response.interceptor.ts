
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponse } from '../../domain/interfaces/IStandarsResponse';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse> {
        return next.handle().pipe(
            map(data => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                success: true,
                message: 'Operation successful',
                data: data,
            })),
        );
    }
}
