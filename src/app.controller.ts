import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

interface Movie {
  id: number;
  title: string;
}

@Controller('movie')
export class AppController {
  constructor(private readonly appService: AppService) {}

  const;
  private movies: Movie[] = [
    {
      title: '반지의 제왕',
      id: 1,
    },
    {
      title: '해리포터',
      id: 2,
    },
  ];

  @Get('/')
  getMovies(@Query('title') title?: string): Movie[] {
    if (!title) {
      return this.movies;
    }
    return this.movies.filter((item: Movie) => {
      return item.title.startsWith(title);
    });
  }

  @Get('/:id')
  getMovie(@Param('id') id: string) {
    const movie = this.movies.find((item) => item.id === +id);

    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다. ');
    }

    return movie;
  }

  private idCounter = 3;

  @Post('/')
  postMovie(@Body('title') title: string): Movie {
    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };
    this.movies.push(movie);
    return movie;
  }

  @Patch('/:id')
  patchMovie(@Param('id') id: string, @Body('title') title: string): Movie {
    const movie = this.movies.find((item) => item.id === +id);
    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }

    Object.assign(movie, { title });

    return movie;
  }

  @Delete('/:id')
  deleteMovie(@Param('id') id: string): string {
    const movieIndex = this.movies.findIndex((item) => item.id === +id);
    if (movieIndex === -1) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }
    this.movies.splice(movieIndex, 1);
    return id;
  }
}
