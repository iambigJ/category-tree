import { MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from '../src/modules/category/entities/category.entity';

export class CreateCategoryTable implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
      //automatilly genrate by app
  }

  async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
      Drop table if exists Categort
      Drop table if exists 
      `)
  }
}
