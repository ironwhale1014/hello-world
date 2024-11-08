import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CursorDto {
  @IsString()
  @IsOptional()
  cursor?: string;

  @IsOptional()
  @IsInt()
  take: number = 5;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  order: string[] = ['id_DESC'];
}
