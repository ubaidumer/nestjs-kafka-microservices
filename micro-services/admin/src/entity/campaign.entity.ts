import {
  campaignCategory,
  campaignCategoryType,
  campaignStatusCategory,
  campaignStatusCategoryType,
} from 'src/utils/constant/campaignConstants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

// Database Table for Campaign
@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: campaignCategory,
  })
  campaignType: campaignCategoryType;

  @Column({
    default: null,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: campaignStatusCategory,
  })
  status: campaignStatusCategoryType;

  @Column({
    default: 0,
    nullable: false,
  })
  voucherUsagePercentage: number;

  @ManyToOne(() => Admin, (admin: Admin) => admin.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  admin: string;

  @Column()
  adminId: string;

  @Column('text', { default: [], nullable: false, array: true })
  customerIds: string[];

  @Column('text', { default: [], nullable: false, array: true })
  voucherId: string[];

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
