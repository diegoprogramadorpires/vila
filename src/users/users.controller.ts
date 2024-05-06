import { Controller, Post, Body, Delete, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete('deactivate/:id')
  deactivate(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.usersService.deactivate(id, token);
  }

}
