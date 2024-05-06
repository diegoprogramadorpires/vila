import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../models/LoginRequestBody';
import { validate } from 'class-validator';
import { RevokedTokenService } from 'src/revokedtoken/revokedtoken.service';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
    constructor(private readonly revokedTokenService: RevokedTokenService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        const loginRequestBody = new LoginRequestBody();

        if (body.email && body.email.includes('@')) {
            loginRequestBody.email = body.email;
        } else if (body.email) {
            loginRequestBody.cpf = body.email;
        }

        loginRequestBody.password = body.password;

        const validations = await validate(loginRequestBody);

        if (validations.length) {
            throw new BadRequestException(
                validations.reduce((acc, curr) => {
                    return [...acc, ...Object.values(curr.constraints)];
                }, []),
            );
        }

        next();
    }
}
