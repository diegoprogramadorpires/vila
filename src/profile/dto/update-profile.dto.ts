import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    name?: string;
}
