import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @IsPublic()
    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refrshToken(@Request() req) {
        return this.authService.refreshToken(req.user);
    }

    @Delete('logout')
    async logout(@Request() req) {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return { message: 'No token provided' };
        }

        await this.authService.logout(token, req.user.id);

        return { message: 'Logout successful' };
    }

    @Post('isValidToken')
    async validateJwt(@Request() req): Promise<{ valid: boolean }> {
        const { token } = req.body;

        if (!token) {
            throw new BadRequestException('Token not provided');
        }

        const isValid = await this.authService.isValidToken(token);

        return { valid: isValid };
    }

}