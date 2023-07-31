import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  shiftCategory,
  shiftCategoryType,
  shiftStatus,
  shiftStatusType,
} from 'src/utils/constants/shiftConstants';
import { Rider } from './rider.entity';

// Database Table for Shift Management of Rider
@Entity()
export class ShiftManagement {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ nullable: true })
  canChangeShift: boolean;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: shiftCategory,
    nullable: true,
  })
  shiftType: shiftCategoryType;

  @Column({
    type: 'enum',
    enum: shiftStatus,
    nullable: true,
  })
  status: shiftStatusType;

  @Column({ nullable: true })
  isSwapable: boolean;

  @Column()
  adminId: string;

  @Column()
  branchId: string;

  @OneToMany(() => Rider, (rider: Rider) => rider.shift)
  rider: Rider[];

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
