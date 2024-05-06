// NestJS
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { RevokedTokenService } from 'src/revokedtoken/revokedtoken.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector,
        private readonly revokedTokenService: RevokedTokenService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        const isTokenRevoked = await this.revokedTokenService.isTokenRevoked(token);

        if (isTokenRevoked) {
            throw new UnauthorizedException('Token revoked');
        }

        const canActivate = super.canActivate(context);

        if (typeof canActivate === 'boolean') {
            return canActivate;
        }

        const canActivatePromise = canActivate as Promise<boolean>;

        return canActivatePromise.catch((error) => {
            if (error instanceof UnauthorizedError) {
                throw new UnauthorizedException(error.message);
            }

            throw new UnauthorizedException();
        });
    }
}