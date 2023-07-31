import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

// Database Table for Address
@Index('address_addressType_customer_', ['customerId', 'addressType'], {
  unique: true,
})
@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  location: string;

  @Column({
    default: null,
    nullable: true,
  })
  landmark: string;

  @Column()
  addressType: string;

  @Column({
    default: null,
    nullable: true,
  })
  specialInstructions: string;

  @Column({
    type: 'float',
    default: null,
    nullable: true,
  })
  lat: number;

  @Column({
    type: 'float',
    default: null,
    nullable: true,
  })
  long: number;

  @ManyToOne(() => Customer, (customer: Customer) => customer.id, {
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
