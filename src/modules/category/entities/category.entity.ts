import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '32' })
  title: string;

  @Column({ nullable: true, type: 'varchar', length: 32 })
  description: string;

  @TreeChildren()
  subCategories: Category[];

  @TreeParent()
  parent: Category;
}
