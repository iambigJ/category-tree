import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
// import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('category')
export class CategoryController {
  constructor() {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {}

  @Get(':id')
  findAll(
    @Query('limit') limit: string,
    @Query('param') param: string,
    @Param('table') table: string,
  ) {
    // return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('recursive') rec: string) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
