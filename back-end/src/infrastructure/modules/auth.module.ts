
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../controllers/auth/auth.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'secretKey', // Fallback for dev
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class AuthModule { }
