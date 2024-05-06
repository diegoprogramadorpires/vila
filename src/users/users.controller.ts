import { Controller, Post, Body, Delete, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @IsPublic()
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'programadorpire12s@gmail.com' },
        password: { type: 'string', example: '123dsdsaA' },
        name: { type: 'string', example: 'diego' },
        cpf: { type: 'string', example: '493.122.230-70' },
      },
      required: ['email', 'password', 'name', 'cpf'],
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete('deactivate/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  deactivate(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1];

    return this.usersService.deactivate(id, token);
  }

}
