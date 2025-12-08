import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { HeadersValidator } from '../validators/headers';

@Injectable()
export class HeadersGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;

        const headersDto = plainToClass(HeadersValidator, {
            apiKey: headers['apikey'] || headers['apiKey'],
            channel: headers['channel'],
            xname: headers['xname'],
        });

        const errors = await validate(headersDto);

        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new BadRequestException(`Missing or invalid headers: ${messages.join(', ')}`);
        }

        return true;
    }
}
