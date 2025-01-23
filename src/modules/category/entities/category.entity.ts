import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @TreeChildren()
  parrentId: Category[];

  @TreeParent()
  parent: Category;

}
