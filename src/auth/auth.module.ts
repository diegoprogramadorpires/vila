import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from '../revokedtoken/entities/revoked-token.entity';
import { RevokedTokenService } from 'src/revokedtoken/revokedtoken.service';
import { RevokedtokenModule } from 'src/revokedtoken/revokedtoken.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([RevokedToken]),
    RevokedtokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy, RevokedTokenService, JwtAuthGuard],
  exports: [AuthService],

})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('login');
  }
}