import {
  riderRankCategory,
  riderRankCategoryType,
  riderStatusCategory,
  riderStatusCategoryType,
} from 'src/utils/constants/riderConstants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { ShiftManagement } from './shift-management.entity';
import { Address } from './address.entity';

export class Coordinates {
  @Column()
  lat: number;

  @Column()
  long: number;
}

// Database Table for Rider
@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: null,
    nullable: true,
  })
  image: string;

  @Column({
    unique: true,
  })
  phoneNo: string;

  @Column({
    unique: true,
  })
  cnic: string;

  @Column({
    unique: true,
  })
  bikeNo: string;

  @Column({
    default: 0,
    nullable: false,
  })
  salary: number;

  @Column({
    default: false,
    nullable: false,
  })
  isAvailable: boolean;

  @Column({
    default: false,
    nullable: false,
  })
  isVerified: boolean;

  @Column({
    default: 0,
    nullable: false,
  })
  totalLeaves: number;

  @Column({
    default: false,
    nullable: false,
  })
  isOnLeave: boolean;

  @Column({
    default: false,
    nullable: false,
  })
  isTrained: boolean;

  @Column({
    default: false,
    nullable: false,
  })
  isOnDelivery: boolean;

  @Column({
    type: 'enum',
    enum: riderRankCategory,
    default: riderRankCategory[0],
  })
  rank: riderRankCategoryType;

  @Column({
    type: 'enum',
    enum: riderStatusCategory,
    default: riderStatusCategory[0],
  })
  status: riderStatusCategoryType;

  @Column('numeric', { array: true, nullable: true })
  score: number[];

  @ManyToOne(() => ShiftManagement, (shift: ShiftManagement) => shift.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinTable()
  shift: ShiftManagement;

  @Column({ nullable: true })
  shiftId: string;

  @Column({
    default: null,
    nullable: true,
  })
  fcmToken: string;

  @Column({
    type: 'jsonb',
    default: null,
    nullable: true,
  })
  coordinates: Coordinates;

  @Column({
    default: null,
    nullable: true,
  })
  branchId: string;

  @Column({
    default: null,
    nullable: true,
  })
  adminId: string;

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

  @ManyToOne(() => Address, (address: Address) => address.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  address: string;

  @Column()
  addressId: string;

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
