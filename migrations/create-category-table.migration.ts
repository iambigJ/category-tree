import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTable1737821017722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the `category` table
    const createTableSQL = `
      CREATE TABLE category (
   id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()), -- Use VARCHAR(36) for auto-generated UUIDs
      title VARCHAR(32) NOT NULL,
      description VARCHAR(32) NULL,
      parentId VARCHAR(36) NULL, -- Allow parentId to be NULL for root categories
      FOREIGN KEY (parentId) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `;
    await queryRunner.query(createTableSQL);

    // Create the `category_closure` table
    const createClosureTableSQL = `
      CREATE TABLE category_closure (
       id_ancestor VARCHAR(36) NOT NULL,
       id_descendant VARCHAR(36) NOT NULL,
       PRIMARY KEY (id_ancestor, id_descendant),
       FOREIGN KEY (id_ancestor) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY (id_descendant) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `;
    await queryRunner.query(createClosureTableSQL);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE category_closure`);
    await queryRunner.query(`DROP TABLE category`);
  }
}
