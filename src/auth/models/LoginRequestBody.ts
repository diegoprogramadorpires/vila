import { IsEmail, IsString, IsNotEmpty, IsOptional, ValidateIf, Matches } from 'class-validator';
import { IsCpf } from '../decorators/IsCpfValid';
import { ApiProperty } from '@nestjs/swagger';


export class LoginRequestBody {
    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @IsEmail({}, { message: 'O campo deve ser um e-mail válido' })
    @IsOptional()
    email?: string;


    @ApiProperty()
    @ValidateIf((object, value) => value !== undefined)
    @IsNotEmpty()
    @IsString()
    @IsCpf()
    @IsOptional()
    cpf?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
