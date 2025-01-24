import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-cat.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';
import { MyLogger } from '../../common/custom-logger/custom-logger';
import { UpdateCategoryDto } from './dto/update-cat.dto'; // Update with your logger path

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
      .moveCategory(id, parrentId)
      .catch((e) => {
        this.logger.error(
          'error on move parrent category',
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

  async findOne(id: string): Promise<Category> {
    this.logger.log(`Finding category with ID: ${id}`);
    return this.categoryRepository
      .findCategoryById(id)
      .then((category) => {
        if (!category) {
          this.logger.warn(`Category with ID ${id} not found`);
          throw new NotFoundException(`Category with ID ${id} not found`);
        }
        this.logger.log(`Found category: ${JSON.stringify(category)}`);
        return category;
      })
      .catch((error) => {
        this.logger.error(
          `Error finding category with ID ${id}: ${error.message}`,
          error.stack,
        );
        throw error; // Re-throw the original error to maintain the correct exception type (NotFoundException or other errors from the repository)
      });
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing category with ID ${id}`);
    return this.categoryRepository
      .delete(id) // Assuming you add a deleteCategory method in the repository
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

  async findSubCategoryFlat() {
    this.logger.log('find all decendent category')
    return this.categoryRepository.findDescendants()
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
