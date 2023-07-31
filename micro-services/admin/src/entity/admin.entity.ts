import {
  adminCategory,
  adminCategoryType,
  adminStatusCategory,
  adminStatusCategoryType,
} from 'src/utils/constant/adminConstants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Database Table for Admin
@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: null,
    nullable: true,
  })
  password: string;

  @Column('enum', {
    enum: adminCategory,
    array: true,
    nullable: true,
  })
  adminType: adminCategoryType[];

  @Column({
    type: 'enum',
    enum: adminStatusCategory,
    default: adminStatusCategory[0],
  })
  status: adminStatusCategoryType;

  @Column('text', { array: true })
  branchIds: string[];

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
