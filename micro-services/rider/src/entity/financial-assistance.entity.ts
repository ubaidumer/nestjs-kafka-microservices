import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rider } from './rider.entity';
import {
  riderFinancialStatusCategory,
  riderFinancialStatusCategoryType,
  riderFinancialTypeCategory,
  riderFinancialTypeCategoryType,
} from 'src/utils/constants/financialConstants';

class ImageDetails {
  mimeType: string;
  originalName: string;
}

// Database Table for Leave Management of Rider
@Entity()
export class FinancialAssistance {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: riderFinancialTypeCategory,
  })
  type: riderFinancialTypeCategoryType;

  @Column({
    type: 'enum',
    enum: riderFinancialStatusCategory,
    default: riderFinancialStatusCategory[0],
  })
  status: riderFinancialStatusCategoryType;

  @Column({ type: 'jsonb', nullable: true, default: null })
  image: ImageDetails;

  @ManyToOne(() => Rider, (rider: Rider) => rider.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  rider: string;

  @Column()
  riderId: string;

  @Column({ default: null, nullable: true })
  adminId: string;

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
