import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  documentCategory,
  documentCategoryType,
  documentStatusCategory,
  documentStatusCategoryType,
} from 'src/utils/constants/documentConstants';
import { Rider } from './rider.entity';

// Database Table for Document of rider
@Entity()
export class DocumentManagement {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'enum',
    enum: documentCategory,
    nullable: false,
  })
  type: documentCategoryType;

  @Column({
    nullable: false,
  })
  key: string;

  @Column({
    nullable: true,
    default: null,
  })
  reason: string;

  @Column({
    type: 'enum',
    enum: documentStatusCategory,
    default: documentStatusCategory[0],
  })
  status: documentStatusCategoryType;

  @ManyToOne(() => Rider, (rider: Rider) => rider.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  rider: string;

  @Column()
  riderId: string;

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
