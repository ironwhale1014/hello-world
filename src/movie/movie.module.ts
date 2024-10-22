import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '../director/entities/director.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, MovieDetail, Director, Genre]),
    CommonModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
