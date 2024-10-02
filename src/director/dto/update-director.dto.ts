import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDirectorDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  nationality?: string;
}
