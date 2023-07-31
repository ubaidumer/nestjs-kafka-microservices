import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rider } from './rider.entity';
import { ShiftManagement } from './shift-management.entity';
import { swapStatus, swapStatusType } from 'src/utils/constants/swapConstant';

// Database Table for Shift Swap of Rider
@Entity()
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: swapStatus[0],
    type: 'enum',
    enum: swapStatus,
  })
  status: swapStatusType;

  @ManyToOne(() => Rider, {
    eager: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  swapedBy: Rider;

  @Column({
    nullable: false,
  })
  swapedWithId: string;

  @OneToOne(() => ShiftManagement, (shift: ShiftManagement) => shift.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  shift: string;

  @Column({ nullable: false })
  shiftId: string;

  @Column({ nullable: false })
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
