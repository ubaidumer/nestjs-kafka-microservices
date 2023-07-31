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
  DocumentObject,
  complianceStatusCategory,
  complianceStatusCategoryType,
  complianceTypeCategory,
  complianceTypeCategoryType,
} from 'src/utils/constants/complianceConstants';

// Database Table for Leave Management of Rider
@Entity()
export class Compliance {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  document: DocumentObject;

  @ManyToOne(() => Rider, (rider: Rider) => rider.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  rider: Rider;

  @Column()
  riderId: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({
    type: 'enum',
    enum: complianceStatusCategory,
    default: complianceStatusCategory[0],
  })
  status: complianceStatusCategoryType;

  @Column({
    type: 'enum',
    enum: complianceTypeCategory,
    default: complianceTypeCategory[0],
  })
  type: complianceTypeCategoryType;

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
