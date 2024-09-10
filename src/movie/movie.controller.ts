import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Movie, MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/')
  getMovies(@Query('title') title?: string): Movie[] {
    return this.movieService.getManyMovies(title);
  }

  @Get('/:id')
  getMovie(@Param('id') id: string) {
    return this.movieService.getMovieById(+id);
  }

  @Post('/')
  postMovie(@Body('title') title: string): Movie {
    return this.movieService.createMovie(title);
  }

  @Patch('/:id')
  patchMovie(@Param('id') id: string, @Body('title') title: string): Movie {
    return this.movieService.updateMovie(+id, title);
  }

  @Delete('/:id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.deleteMovie(+id);
  }
}
