import { IsOptional, IsString } from 'class-validator';
import { PagePaginationDto } from '../../common/dto/PaginationDto';

export class GetMovieDto extends PagePaginationDto {
  @IsString()
  @IsOptional()
  title?: string;
}
