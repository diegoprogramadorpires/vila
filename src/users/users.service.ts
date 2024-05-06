import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { Users } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  async create(newUser: CreateUserDto): Promise<Users> {
    let { email, cpf } = newUser;

    email = email.trim();
    cpf = cpf.replace(/[^\d]+/g, '');

    let user;

    if (email.includes('@')) {
      user = await this.findByEmailOrCpf(email);
    } else {
      user = await this.findByEmailOrCpf(cpf);
    }

    if (user) {
      throw new ConflictException(`User '${newUser.name}' already registered`);
    }

    const hashedPassword = bcryptHashSync(newUser.password, 10);

    const userToCreate = this.usersRepository.create({
      ...newUser,
      id: uuid(),
      email,
      cpf,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    return this.usersRepository.save(userToCreate);
  }

  async findByUserName(cpf: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(user: UpdateUserDto): Promise<Users> {

    return await this.usersRepository.save(user);
  }

  async findByEmailOrCpf(identifier: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: [
        { email: identifier },
        { cpf: identifier }
      ]
    });
  }

  async findById(id: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async deactivate(id: string, token): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    user.password = '';
    user.isActive = false;

    await this.usersRepository.save(user);

    await this.authService.logout(token, id);
  }
}
