import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { UpdateCategoryDto } from './dto/update-cat.dto';
import { Category } from './entities/category.entity';
import { MoveCategoryDto } from './dto/move-cat.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Put(':id')
  async moveCategory(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @Body() moveCategoryDto: MoveCategoryDto,
  ) {
    return this.categoryService.moveCategory(
      categoryId,
      moveCategoryDto.parrentId,
    );
  }

  @Get('findAll')
  findCategoryTree(): Promise<Category[]> {
    return this.categoryService.findCategoryTree();
  }

  @Get('subcategories/:id')
  findSubcategories(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findSubcategories(id);
  }

  @Get(':id')
  findSubCategoriesFlat(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
