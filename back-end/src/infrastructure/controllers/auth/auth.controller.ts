
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../../decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private jwtService: JwtService) { }

    @Public()
    @Post('login')
    async login(@Body() body: any) {
        console.log('Login attempt:', body);
        // Mock user validation
        if (body.username === 'admin' && body.password === 'admin') {
            const payload = { username: body.username, sub: 1 };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        throw new UnauthorizedException();
    }
}
