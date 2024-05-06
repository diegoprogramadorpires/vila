import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UsersService } from '../users/users.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { Users } from 'src/users/entities/user.entity';
import { RevokedTokenService } from 'src/revokedtoken/revokedtoken.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        private readonly revokedTokenService: RevokedTokenService,
    ) { }

    async login(user: Users): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };

        return {
            access_token: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    async validateUser(email: string, password: string): Promise<Users> {
        let user: any;

        if (email.includes('@')) {
            user = await this.userService.findByEmailOrCpf(email.trim());
        } else {
            user = await this.userService.findByEmailOrCpf(email.replace(/[^\d]+/g, ''));
        }

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }

        throw new UnauthorizedError(
            'Email address or password provided is incorrect.',
        );
    }

    async refreshToken(user: Users): Promise<UserToken> {

        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async logout(token: string, idUser: string): Promise<void> {
        // const isTokenRevoked = await this.revokedTokenService.isTokenRevoked(token);
        // if (!isTokenRevoked) {
        await this.revokedTokenService.revokeToken(token, idUser);
        // }
    }
    async isValidToken(token: string): Promise<boolean> {
        try {
            const decoded = this.jwtService.verify(token);
            return !!decoded;
        } catch (error) {
            return false;
        }
    }

    async deleteSession(token: string, idUser: string): Promise<void> {
        // const isTokenRevoked = await this.revokedTokenService.isTokenRevoked(token);
        // if (!isTokenRevoked) {
        await this.revokedTokenService.revokeToken(token, idUser);
        // }
    }


}