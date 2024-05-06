import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedTokenService } from './revokedtoken.service';
import { RevokedToken } from './entities/revoked-token.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([RevokedToken]),
  ],
  providers: [RevokedTokenService],
  exports: [RevokedTokenService],

})
export class RevokedtokenModule { }
