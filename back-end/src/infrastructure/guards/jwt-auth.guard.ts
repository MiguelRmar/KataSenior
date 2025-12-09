
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log(`[JwtAuthGuard] ${request.method} ${request.url}`);
        const authHeader = request.headers['authorization'];
        console.log(`[JwtAuthGuard] Authorization Header: ${authHeader ? 'Present' : 'Missing'} (${authHeader?.substring(0, 15)}...)`);

        if (request.method === 'OPTIONS') {
            console.log('[JwtAuthGuard] Allowing OPTIONS');
            return true;
        }

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        console.log(`[JwtAuthGuard] Is Public? ${isPublic}`);

        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}
