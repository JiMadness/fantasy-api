import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TeamModule } from '../team/team.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [TeamModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      };
    },
    inject: [ConfigService],
  })],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})

export class AuthModule {
}
