import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getManyMovies(title?: string) {
    const movies = await this.movieRepository.find();

    return movies;
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다. ');
    }
    return movie;
  }

  async createMovie(body: CreateMovieDto) {
    return await this.movieRepository.save(body);
  }

  async updateMovie(id: number, body: UpdateMovieDto) {
    const updateResultPromise = await this.movieRepository.update(id, body);

    if (!updateResultPromise) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }

    const newMovie = await this.movieRepository.findOne({ where: { id } });

    return newMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }

    await this.movieRepository.delete(movie);

    return id;
  }
}
