import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-cat.dto';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['parentId']),
) {}
