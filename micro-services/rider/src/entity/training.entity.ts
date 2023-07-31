import {
  traningStatus,
  traningStatusType,
  traningType,
  traningTypeValue,
} from 'src/utils/constants/traningConstant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Database Table for training
@Entity()
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    unique: true,
    default: '',
    nullable: false,
  })
  title: string;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: traningStatus,
    default: traningStatus[0],
  })
  status: traningStatusType;

  @Column({
    type: 'enum',
    enum: traningTypeValue,
  })
  type: traningType;

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
