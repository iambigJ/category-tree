import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  Repository,
  TreeRepository,
  FindManyOptions,
} from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { UpdateCategoryDto } from './dto/update-cat.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private readonly treeRepository: TreeRepository<Category>;

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
  // Move a category to a new parent

  async moveCategory(categoryId: string, parentId: string): Promise<Category> {
    return await this.dataSource.transaction(async () => {
      // No need for manager parameter

      const category = await this.treeRepository.findOne({
        // Use this.treeRepository
        where: { id: categoryId },
        relations: ['parent'],
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      if (parentId === null) {
        category.parent = null;
      } else {
        const newParent = await this.treeRepository.findOneBy({ id: parentId }); // Use this.treeRepository
        if (!newParent) {
          throw new NotFoundException(
            `Parent category with ID ${parentId} not found`,
          );
        }
        category.parent = newParent;
      }

      return await this.treeRepository.save(category); // Use this.treeRepository
    });
  }

  async findDescendants(id: string): Promise<Category[]> {
    return await this.treeRepository.findDescendants(await this.fi);
  }

  async findTrees() {
    return this.treeRepository.findTrees();
  }

  async findDescendantsTree(id: string): Promise<Category> {
    return this.treeRepository.findDescendantsTree(
      await this.findCategoryById(id),
    );
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
      relations: ['parent'],
    });
  }

  // Method to get all children (descendants) associated with a tree
  async findAllDescendantsTree(category: Category): Promise<Category> {
    return await this.treeRepository.findDescendantsTree(category);
  }

  myFind(id: string): Promise<Category | null> {
    return this.findOne({
      where: {
        id: id,
      },
      relations: ['parent'],
    });
  }

  // Method to get all parents (ancestors) associated with a tree
  async findAllAncestorsTree(category: Category): Promise<Category> {
    return await this.treeRepository.findAncestorsTree(category);
  }
}
