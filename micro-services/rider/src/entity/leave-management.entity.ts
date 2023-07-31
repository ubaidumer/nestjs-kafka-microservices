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
  leaveCategory,
  leaveCategoryType,
  leaveStatus,
  leaveStatusType,
} from 'src/utils/constants/leaveConstants';

// Database Table for Leave Management of Rider
@Entity()
export class LeaveManagement {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    default: new Date(),
    type: 'timestamp',
  })
  startTime: Date;

  @Column({
    default: new Date(),
    type: 'timestamp',
  })
  endTime: Date;

  @Column({
    default: null,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: leaveCategory,
  })
  leaveType: leaveCategoryType;

  @Column({
    type: 'enum',
    enum: leaveStatus,
  })
  status: leaveStatusType;

  @ManyToOne(() => Rider, (rider: Rider) => rider.id, {
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
