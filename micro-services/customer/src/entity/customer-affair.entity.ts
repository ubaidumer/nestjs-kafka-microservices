import {
  customerAffairStatusCategory,
  customerAffairStatusCategoryType,
} from 'src/utils/constant/customer-affairConstant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

// Database Table for Customer Affair
@Entity()
export class CustomerAffair {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: customerAffairStatusCategory,
  })
  status: customerAffairStatusCategoryType;

  @Column({
    default: null,
    nullable: true,
  })
  image: string;

  @ManyToOne(() => Customer, (customer: Customer) => customer.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  customer: string;

  @Column()
  customerId: string;

  @Column({
    nullable: true,
    default: null,
    unique: true,
  })
  orderId: string;

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
