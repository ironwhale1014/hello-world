import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.findAndCount();
  }

  async findOne(id: number) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) {
      throw new NotFoundException('not found user');
    }

    return findUser;
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) {
      throw new NotFoundException('not found user');
    }
    await this.userRepository.update({ id }, updateUserDto);

    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) {
      throw new NotFoundException('not found user');
    }

    await this.userRepository.delete(id);

    return `This action removes a #${id} user`;
  }
}
