
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponse } from '../../domain/interfaces/IStandarsResponse';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
    constructor(private encryptionService: EncryptionService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                const encryptedData = data ? this.encryptionService.encrypt(data) : null;
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    success: true,
                    message: 'Operation successful',
                    data: encryptedData as any,
                };
            }),
        );
    }
}
