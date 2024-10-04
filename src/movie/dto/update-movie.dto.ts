import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // title?: string;
  //
  // @IsOptional()
  // @ArrayNotEmpty()
  // @IsArray()
  // @IsNumber(
  //   {},
  //   {
  //     each: true,
  //   },
  // )
  // genreIds?: number[];
  //
  // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // detail?: string;
  //
  // @IsNotEmpty()
  // @IsOptional()
  // @IsNumber()
  // directorId?: number;
}
