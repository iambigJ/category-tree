import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class MoveCategoryDto {
  @IsOptional()
  @IsString()
  parrentId?: string;
}
