import { Injectable, NotFoundException } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class MovieService {
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

  getManyMovies(title: string): Movie[] {
    if (!title) {
      return this.movies;
    }
    return this.movies.filter((item: Movie) => {
      return item.title.startsWith(title);
    });
  }

  getMovieById(id: number): Movie {
    const movie = this.movies.find((item) => item.id === id);

    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다. ');
    }

    return movie;
  }

  private idCounter = 3;

  createMovie(title: string) {
    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };
    this.movies.push(movie);

    return movie;
  }

  updateMovie(id: number, title: string) {
    const movie = this.movies.find((item) => item.id === id);
    if (!movie) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }

    Object.assign(movie, { title });

    return movie;
  }

  deleteMovie(id: number) {
    const movieIndex = this.movies.findIndex((item) => item.id === +id);
    if (movieIndex === -1) {
      throw new NotFoundException('존재 하지 않는 영화 입니다.');
    }
    this.movies.splice(movieIndex, 1);

    return movieIndex;
  }
}
