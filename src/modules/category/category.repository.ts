// import { Injectable } from '@nestjs/common';
// import {
//   DataSource,
//   Repository,
//   TreeRepository,
//   FindManyOptions,
// } from 'typeorm';
// import { Category } from './entities/category.entity';
// import { CreateCategoryDto } from './dto/create-category.dto';
//
// @Injectable()
// export class CategoryRepository extends Repository<Category> {
//   private readonly treeRepository: TreeRepository<Category>;
//   constructor(private dataSource: DataSource) {
//     super(Category, dataSource.createEntityManager());
//     this.treeRepository = dataSource.manager.getTreeRepository(Category);
//   }
//   async findTrees(): Promise<Category[]> {
//     return await this.treeRepository.findTrees();
//   }
//
//   async findDescendants(category: Category): Promise<Category[]> {
//     return await this.treeRepository.findDescendants(category);
//   }
//
//   async findDescendantsTree(category: Category): Promise<Category> {
//     const categoryWithChildren =
//       await this.treeRepository.findDescendantsTree(category);
//     return this.transformToSubCategories(categoryWithChildren);
//   }
//
//   async findAncestorsTree(category: Category): Promise<Category> {
//     return await this.treeRepository.findAncestorsTree(category);
//   }
//
//   private transformToSubCategories(category: Category): Category {
//     const transformedCategory = { ...category } as any;
//     if (
//       transformedCategory.parrentId &&
//       transformedCategory.parrentId.length > 0
//     ) {
//       transformedCategory.subCategories = transformedCategory.parrentId.map(
//         (child) => this.transformToSubCategories(child),
//       );
//     } else {
//       transformedCategory.subCategories = [];
//     }
//
//     delete transformedCategory.parrentId;
//     return transformedCategory as Category;
//   }
//
//   async createCategory(
//     createCategoryDto: CreateCategoryDto,
//   ): Promise<Category> {
//     const category = this.create(createCategoryDto);
//     if (createCategoryDto.parentId) {
//       const parent = await this.findOne({
//         where: { id: createCategoryDto.parentId },
//       });
//       if (!parent) {
//         throw new Error('Parent category not found');
//       }
//       category.parent = parent;
//     }
//     return this.save(category);
//   }
//
//   async findAllCategories(limit: number, offset: number): Promise<Category[]> {
//     const options: FindManyOptions<Category> = {
//       take: limit,
//       skip: offset,
//       relations: ['parent'],
//     };
//     return this.find(options);
//   }
//
//   async findCategoryById(id: number): Promise<Category> {
//     return this.findOne({
//       where: { id },
//       relations: ['parent'],
//     });
//   }
// }
