import { IsNotEmpty, IsString } from 'class-validator';

export class MoveCategoryDto {
  @IsNotEmpty()
  @IsString()
  parrentId: string;
}
