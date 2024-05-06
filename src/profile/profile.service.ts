import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from './entities/profile.entity';
import { UsersService } from 'src/users/users.service';
import { UserDetails } from './interfaces/UserDetails';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    private readonly usersService: UsersService,
  ) { }

  async create(createProfileDto: CreateProfileDto, idUser: string): Promise<UserProfile> {
    const existingProfile = await this.profileRepository.findOne({ where: { user: { id: idUser } } });

    if (existingProfile) {
      throw new ConflictException(`Profile already exists for this user`);
    }
    const user = await this.usersService.findById(idUser);
    if (!user) {
      throw new Error('User not found');
    }
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user: user,
    });
    return await this.profileRepository.save(profile);
  }

  async userDetails(id: string): Promise<UserDetails> {

    const profile = await this.profileRepository.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :userId', { userId: id })
      .getOne();

    if (!profile) {
      throw new NotFoundException(`Profile not found`);
    }

    const cpf = profile.user.cpf.replace(/\D/g, '').replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');

    const userDetails = {
      id: profile.user.id,
      email: profile.user.email,
      cpf: cpf,
      name: profile.user.name,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      contactInfo: profile.contactInfo
    };

    return userDetails;
  }

  async findAll(): Promise<UserProfile[]> {
    return await this.profileRepository.find();
  }


  async findOne(id: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile not found`);
    }
    return profile;
  }


  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {

    const profileAndUser: any = await this.profileRepository.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :userId', { userId: id })
      .getOne();

    const { user, ...profile } = profileAndUser;

    if (!profileAndUser) {
      throw new NotFoundException(`Profile not found`);
    }

    const newProfile = Object.assign(profile, {
      bio: updateProfileDto.bio,
      profilePicture: updateProfileDto.profilePicture,
      contactInfo: {
        ...profile.contactInfo,
        ...(updateProfileDto.contactInfo ? updateProfileDto.contactInfo : {})
      }
    });

    if (user) {

      const newUser = Object.assign(user, {
        email: updateProfileDto.email.trim().toLowerCase(),
        cpf: updateProfileDto.cpf.replace(/\D/g, ''),
        name: updateProfileDto.name.trim(),
      });

      await this.usersService.updateUser(newUser);
    }

    return await this.profileRepository.save(newProfile);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await this.profileRepository.remove(profile);
  }
}
