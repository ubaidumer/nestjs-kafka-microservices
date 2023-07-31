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

// Database Table for Customer Fav
@Index('customerfav_customer_product_', ['customerId', 'productId'], {
  unique: true,
})
@Entity()
export class CustomerFav {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  productId: string;

  @ManyToOne(() => Customer, (customer: Customer) => customer.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  customer: string;

  @Column()
  customerId: string;

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
