import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // name?: string;
}
