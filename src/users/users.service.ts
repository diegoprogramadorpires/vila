import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { CreateUserResponse } from './entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {

  // constructor(
  //   @InjectRepository(UserEntity)
  //   private usersRepository: Repository<UserEntity>,
  // ) { }
  private users: CreateUserDto[] = [];

  async create(newUser: CreateUserDto): Promise<any> {
    const user = {
      ...newUser,
      id: uuid(),
      password: bcryptHashSync(newUser.password, 10)
    }
    this.users.push(user);
    // const userAlreadyRegistered = await this.findByUserName(newUser.username);

    // if (userAlreadyRegistered) {
    //   throw new ConflictException(
    //     `User '${newUser.name}' already registered`,
    //   );
    // }

    // const dbUser = new UserEntity();
    // dbUser.username = newUser.username;
    // dbUser.passwordHash = bcryptHashSync(newUser.password, 10);

    // const { id, username } = await this.usersRepository.save(dbUser);
    return this.users;
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
