import { traningStatus } from 'src/utils/constants/traningConstant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Database Table for training
@Entity()
export class Faqs {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    nullable: false,
  })
  question: string;

  @Column({
    nullable: false,
  })
  answer: string;

  @Column({
    type: 'enum',
    enum: traningStatus,
    default: traningStatus[0],
  })
  status: string;

  @Column({
    default: null,
    nullable: true,
  })
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
