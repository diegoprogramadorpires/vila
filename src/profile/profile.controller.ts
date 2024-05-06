import { Controller, Request, Get, Post, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    const { id } = req.user
    return await this.profileService.create(createProfileDto, id);
  }

  @Get('userDetails')
  async UserDetails(@Request() req) {
    const { id } = req.user
    return await this.profileService.userDetails(id);
  }


  @Patch('editUser')
  async update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const { id } = req.user
    return await this.profileService.update(id, updateProfileDto);
  }

}
