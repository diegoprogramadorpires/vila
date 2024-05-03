import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { Users } from './entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async create(newUser: CreateUserDto): Promise<Users> {
    const userAlreadyRegistered = await this.findByUserName(newUser.cpf);

    if (userAlreadyRegistered) {
      throw new ConflictException(`User '${newUser.name}' already registered`);
    }

    const user = this.usersRepository.create({
      ...newUser,
      id: uuid(),
      password: bcryptHashSync(newUser.password, 10),
    });

    return this.usersRepository.save(user);
  }

  async findByUserName(cpf: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
