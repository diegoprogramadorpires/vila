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
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string', example: 'programadorpire12s@gmail.com' },
                password: { type: 'string', example: '123dsdsaA' },
            },
            required: ['email', 'password'],
        },
    })
    async login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @IsPublic()
    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                refresh: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNTY5NWVjZC1hYjFkLTRiMzgtYjllMS0wNThkZjA2MTczYWYiLCJlbWFpbCI6InByb2dyYW1hZG9ycGlyZTFzQGdtYWlsLmNvbSIsIm5hbWUiOiJkaWVnbyIsImlhdCI6MTcxNDg1OTMwOCwiZXhwIjoxNzE1NDY0MTA4fQ.6ZsBkyE5KRoNlgVbdWJZuA4DLC4Tx7Ynzq-IyGrxMz4' },
            },
            required: ['refresh'],
        },
    })
    async refrshToken(@Request() req) {
        return this.authService.refreshToken(req.user);
    }

    @ApiBearerAuth()
    @Delete('logout')
    async logout(@Request() req) {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return { message: 'No token provided' };
        }

        await this.authService.logout(token, req.user.id);

        return { message: 'Logout successful' };
    }

    @ApiBearerAuth()
    @Post('isValidToken')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNTY5NWVjZC1hYjFkLTRiMzgtYjllMS0wNThkZjA2MTczYWYiLCJlbWFpbCI6InByb2dyYW1hZG9ycGlyZTFzQGdtYWlsLmNvbSIsIm5hbWUiOiJkaWVnbyIsImlhdCI6MTcxNDkzODM5MCwiZXhwIjoxNzE0OTM4NTEwfQ.U31qXQ8AiddUyvD9WlwYle6WzFUZd1j86tK_MDRadYk' },
            },
            required: ['token'],
        },
    })
    async validateJwt(@Request() req): Promise<{ valid: boolean }> {
        const { token } = req.body;

        if (!token) {
            throw new BadRequestException('Token not provided');
        }

        const isValid = await this.authService.isValidToken(token);

        return { valid: isValid };
    }

}