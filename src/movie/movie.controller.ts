import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/')
  getMovies(
    @Request() payload: any,
    @Query('title', MovieTitleValidationPipe) title?: string,
  ) {
    console.log(payload.user);
    return this.movieService.getManyMovies(title);
  }

  @Get('/:id')
  getMovie(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.movieService.getMovieById(+id);
  }

  @Post('/')
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.createMovie(body);
  }

  @Patch('/:id')
  patchMovie(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie(+id, body);
  }

  @Delete('/:id')
  deleteMovie(@Param('id', ParseIntPipe) id: string) {
    return this.movieService.deleteMovie(+id);
  }
}
