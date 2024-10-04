import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectorDto } from './create-director.dto';

export class UpdateDirectorDto extends PartialType(CreateDirectorDto) {
  // @IsOptional()
  // @IsNotEmpty()
  // @IsString()
  // name?: string;
  //
  // @IsNotEmpty()
  // @IsDateString()
  // @IsOptional()
  // dob?: Date;
  //
  // @IsNotEmpty()
  // @IsOptional()
  // @IsString()
  // nationality?: string;
}
