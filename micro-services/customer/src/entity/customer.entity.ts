import {
  customerCategory,
  customerCategoryType,
} from 'src/utils/constant/customerConstant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';

// Database Table for Customer
@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    default: null,
    nullable: true,
  })
  fullName: string;

  @Column({
    default: null,
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    default: false,
    nullable: false,
  })
  blockCod: boolean;

  @Column({
    default: null,
    nullable: true,
  })
  dob: Date;

  @Column({
    default: null,
    nullable: true,
  })
  image: string;

  @Column({
    default: null,
    nullable: true,
    unique: true,
  })
  phoneNo: string;

  @Column({
    default: null,
    nullable: true,
  })
  reason: string;

  @Column({
    default: null,
    nullable: true,
  })
  reasonSubject: string;

  @Column({
    default: 0,
    nullable: true,
  })
  revenue: number;

  @Column({
    default: 'ACTIVE',
    nullable: true,
  })
  status: string;

  @Column({ default: null, nullable: true })
  ipAddress: string;

  @Column('text', { array: true, default: [] })
  alternatePhoneNo: string[];

  @Column({
    type: 'json',
    nullable: true,
    default: null,
  })
  deviceInfo: {};

  @Column({
    type: 'json',
    default: null,
    nullable: true,
  })
  osInfo: {};

  @Column({
    type: 'json',
    default: null,
    nullable: true,
  })
  clientInfo: {};

  @Column({
    type: 'enum',
    enum: customerCategory,
  })
  customerType: customerCategoryType;

  @OneToMany(() => Address, (address: Address) => address.customer)
  address: Address[];

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
