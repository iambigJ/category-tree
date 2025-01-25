import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';
import { MyLogger } from '../../common/custom-logger/custom-logger';
import { UpdateCategoryDto } from './dto/update-cat.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new MyLogger(CategoryService.name); // Use your custom logger

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`Creating category with data`, createCategoryDto);
    return this.categoryRepository
      .createCategory(createCategoryDto)
      .then((createdCategory) => {
        this.logger.log(`Category created successfully`, createCategoryDto);
        return createdCategory;
      })
      .catch((error) => {
        this.logger.error(
          `Error creating category: ${error.message}`,
          error.stack,
        );
        throw new UnprocessableEntityException(error?.message);
      });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log('Updating category param', updateCategoryDto);
    return this.categoryRepository
      .updateCategory(id, updateCategoryDto)
      .catch((e) => {
        this.logger.error(
          'error on update cetegory properties',
          e.stack,
          e?.message,
        );
        throw new UnprocessableEntityException(e?.message);
      });
  }

  async moveCategory(id: string, parrentId: string) {
    this.logger.debug('start move parrent category', { id, parrentId });
    return await this.categoryRepository
      .moveCategoryParent(id, parrentId)
      .catch((e) => {
        this.logger.error(
          'error on move parent category',
          e?.stack,
          e?.message,
        );
        throw new UnprocessableEntityException(e?.message);
      });
  }

  async findAll(limit: number, offset: number): Promise<Category[]> {
    this.logger.log(`Finding all categories`, { limit, offset });
    return await this.categoryRepository
      .findAllCategories(limit, offset)
      .catch((e) => {
        this.logger.error(`Error finding all categories`, e?.stack, e?.message);
        throw new UnprocessableEntityException();
      });
  }

  async findFlat(id: string) {
    this.logger.log('find all categories decentent');
    return this.categoryRepository.findDecendant(id).catch((e) => {
      this.logger.error('error getting decendant', e?.stack);
      throw new UnprocessableEntityException(e?.message);
    });
  }

  async findOne(id: string): Promise<Category> {
    this.logger.log(`Finding category with ID: ${id}`);
    try {
      const category = await this.categoryRepository.findCategoryById( id );

      if (!category) {
        this.logger.warn(`Category with ID ${id} not found`);
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      this.logger.error(
        `Error finding category with ID ${id}: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      } else {
        throw new UnprocessableEntityException('Error finding category');
      }
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing category with ID ${id}`);
    return this.categoryRepository
      .removeCategory(id)
      .then(() => {
        this.logger.log(`Category with ID ${id} removed successfully`);
      })
      .catch((error) => {
        this.logger.error(
          `Error removing category with ID ${id}: ${error.message}`,
          error.stack,
        );
        throw error;
      });
  }

  async findCategoryTree(): Promise<Category[]> {
    this.logger.log('Finding category tree');
    return this.categoryRepository
      .findTrees()
      .then((categoryTree) => {
        this.logger.log(
          `Found category tree with ${categoryTree.length} root categories`,
        );
        return categoryTree;
      })
      .catch((error) => {
        this.logger.error(
          `Error finding category tree: ${error.message}`,
          error.stack,
        );
        throw error;
      });
  }

  async findSubcategories(id: string): Promise<Category> {
    this.logger.log(`Finding subcategories for category with ID ${id}`);
    return this.categoryRepository
      .findDescendantsTree(id)
      .then((subcategories) => {
        this.logger.log(
          `Found subcategories: ${JSON.stringify(subcategories)}`,
        );
        return subcategories;
      })
      .catch((error) => {
        this.logger.error(
          `Error finding subcategories for category with ID ${id}: ${error.message}`,
          error.stack,
        );
        throw new UnprocessableEntityException();
      });
  }
}
