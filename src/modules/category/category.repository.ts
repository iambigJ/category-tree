import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  Repository,
  TreeRepository,
  FindManyOptions,
  QueryRunner,
} from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { UpdateCategoryDto } from './dto/update-cat.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private readonly treeRepository: TreeRepository<Category>;
  //using typeorm is not efficient i think using raw query is more efficient and using recursive cte
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
    this.treeRepository = dataSource.manager.getTreeRepository(Category);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.create(createCategoryDto);
    if (createCategoryDto.parentId) {
      const parent = await this.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }
    return this.save(category);
  }

  async removeCategory(categoryId: string) {
    const res = await this.delete(categoryId);
    if (res?.affected == 0) {
      throw new Error('Not Found Entity');
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return this.save(category);
  }

  async moveCategoryParent(
    categoryId: string,
    newParentId: string | null,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const child = await manager.getTreeRepository(Category).findOne({
        where: { id: categoryId },
        relations: ['parent'],
      });

      if (!child) {
        throw new Error(`Category (child) with ID '${categoryId}' not found`);
      }

      let parentCategory: Category | null = null;
      if (newParentId) {
        parentCategory = await manager.getTreeRepository(Category).findOne({
          where: { id: newParentId },
        });
        if (!parentCategory) {
          throw new Error(
            `Category (parent) with ID '${newParentId}' not found`,
          );
        }
      }

      child.parent = parentCategory || null;

      await manager.getTreeRepository(Category).save(child);
    });
  }

  async findTrees() {
    return this.treeRepository.findTrees();
  }

  async findDescendantsTree(id: string): Promise<Category> {
    return this.treeRepository.findDescendantsTree(
      await this.findCategoryById(id),
    );
  }

  async findDescendant(id: string) {
    return this.treeRepository.findDescendants(await this.findCategoryById(id));
  }

  async findAllCategories(limit: number, offset: number): Promise<Category[]> {
    const options: FindManyOptions<Category> = {
      take: limit,
      skip: offset,
      relations: ['parrent'],
    };
    return this.find(options);
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.findOne({
      where: { id },
      relations: ['parent', 'subCategories'],
    });
  }
}
