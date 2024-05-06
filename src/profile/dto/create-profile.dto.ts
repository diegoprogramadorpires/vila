import { IsEmail, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { UserProfile } from "../entities/profile.entity";
import { Type } from "class-transformer";
import { Users } from "src/users/entities/user.entity";

export class ContactInfoDto {
    @IsOptional()
    @IsEmail()
    secondaryEmail?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}

export class CreateProfileDto {
    @IsString()
    bio: string;

    @IsString()
    profilePicture: string;

    @ValidateNested()
    @Type(() => ContactInfoDto)
    contactInfo: ContactInfoDto;

    @IsOptional()
    @IsString()
    userId?: string;
}

