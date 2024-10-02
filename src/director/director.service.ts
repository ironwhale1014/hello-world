import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  create(createDirectorDto: CreateDirectorDto) {
    return this.directorRepository.save(createDirectorDto);
  }

  findAll() {
    return this.directorRepository.find({ relations: ['movie'] });
  }

  async findOne(id: number) {
    return await this.directorRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.directorRepository.findOne({ where: { id } });
    console.log(director);
    if (!director) {
      throw new NotFoundException(`${id}의 데이터가 없습니다.`);
    }

    await this.directorRepository.update({ id }, { ...updateDirectorDto });

    const newDirector = await this.directorRepository.findOne({
      where: { id },
    });
    return newDirector;
  }

  async remove(id: number) {
    const director = await this.directorRepository.findOne({ where: { id } });
    if (!director) {
      throw new NotFoundException(`${id}의 데이터가 없습니다.`);
    }

    await this.directorRepository.delete(id);
    return id;
  }
}
