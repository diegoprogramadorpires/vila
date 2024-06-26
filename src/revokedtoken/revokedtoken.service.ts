import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedToken } from './entities/revoked-token.entity';

@Injectable()
export class RevokedTokenService {
    constructor(
        @InjectRepository(RevokedToken)
        private readonly revokedTokenRepository: Repository<RevokedToken>,
    ) { }

    async revokeToken(token: string, idUser: string): Promise<void> {
        const revokedToken = new RevokedToken();
        revokedToken.token = token;
        revokedToken.exp = new Date();
        revokedToken.userId = idUser;

        await this.revokedTokenRepository.save(revokedToken);
    }

    async isTokenRevoked(token: string): Promise<boolean> {
        const revokedToken = await this.revokedTokenRepository.findOne({ where: { token } });
        return !!revokedToken;
    }
}