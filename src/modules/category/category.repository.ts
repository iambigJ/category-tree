import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  Repository,
  TreeRepository,
  FindManyOptions,
  QueryRunner,
  FindOptionsWhere,
} from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { UpdateCategoryDto } from './dto/update-cat.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private readonly treeRepository: TreeRepository<Category>;

  constructor(private readonly dataSource: DataSource) {
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
        relations: ['parent'],
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${createCategoryDto.parentId} not found`,
        );
      }
      category.parent = parent;
    }

    return this.save(category);
  }

  async removeCategory(categoryId: string): Promise<void> {
    const result = await this.treeRepository.delete(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne({
      where: { id },
      relations: ['parent', 'subCategories'],
    });

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
        relations: ['parent', 'subCategories'],
      });

      if (!child) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      let parentCategory: Category | null = null;
      if (newParentId) {
        parentCategory = await manager.getTreeRepository(Category).findOne({
          where: { id: newParentId },
          relations: ['parent'],
        });

        if (!parentCategory) {
          throw new NotFoundException(
            `Parent category with ID ${newParentId} not found`,
          );
        }
      }

      child.parent = parentCategory;
      await manager.getTreeRepository(Category).save(child);
    });
  }

  async findTrees(): Promise<Category[]> {
    return this.treeRepository.findTrees();
  }

  async findAncestors(id: string): Promise<Category[]> {
    const category = await this.findCategoryById(id);
    return this.treeRepository.findAncestors(category);
  }

  async findAncestorsTree(id: string): Promise<Category> {
    const category = await this.findCategoryById(id);
    return this.treeRepository.findAncestorsTree(category);
  }

  async findDescendantsTree(id: string, depth?: number): Promise<Category> {
    const category = await this.findCategoryById(id);
    return this.treeRepository.findDescendantsTree(category, {
      depth: depth,
    });
  }

  async findDescendants(id: string, depth?: number): Promise<Category[]> {
    const category = await this.findCategoryById(id);
    return this.treeRepository.findDescendants(category, {
      depth: depth,
    });
  }

  async findAllCategories(
    limit: number,
    offset: number,
  ): Promise<[Category[], number]> {
    const options: FindManyOptions<Category> = {
      take: limit,
      skip: offset,
      relations: ['parent', 'subCategories'],
    };
    return this.treeRepository.findAndCount(options);
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.findOne({
      where: { id },
      relations: ['parent', 'subCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
