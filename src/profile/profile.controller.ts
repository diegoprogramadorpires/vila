import { Controller, Request, Get, Post, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bio: { type: 'string', example: 'Minha biografia' },
        profilePicture: { type: 'string', format: 'url', example: 'https://example.com/profile.jpg' },
        contactInfo: {
          type: 'object',
          properties: {
            secondaryEmail: { type: 'string', format: 'email', example: 'example@example.com' },
            phoneNumber: { type: 'string', example: '41999028210' },
          },
          required: ['secondaryEmail', 'phoneNumber'],
        },
      },
      required: ['bio', 'profilePicture', 'contactInfo'],
    },
  })
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    const { id } = req.user
    return await this.profileService.create(createProfileDto, id);
  }

  @Get('userDetails')
  async UserDetails(@Request() req) {
    const { id } = req.user
    return await this.profileService.userDetails(id);
  }

  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bio: { type: 'string', example: 'Minha biografia' },
        profilePicture: { type: 'string', format: 'url', example: 'https://example.com/profile.jpg' },
        contactInfo: {
          type: 'object',
          properties: {
            secondaryEmail: { type: 'string', format: 'email', example: 'example@example.com' },
            phoneNumber: { type: 'string', example: '41999028210' },
          },
          required: ['secondaryEmail', 'phoneNumber'],
        },
      },
      required: ['bio', 'profilePicture', 'contactInfo'],
    },
  })
  @Patch('editUser')
  async update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const { id } = req.user
    return await this.profileService.update(id, updateProfileDto);
  }

}
