import { IsOptional, IsString } from 'class-validator';
import { CursorDto } from '../../common/dto/cursor.dto';

export class GetMovieDto extends CursorDto {
  @IsString()
  @IsOptional()
  title?: string;
}
