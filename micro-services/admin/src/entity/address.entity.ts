import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

// Database Table for Admin Address
@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  location: string;

  @Column({
    default: null,
    nullable: true,
  })
  landmark: string;

  @Column({
    default: null,
    nullable: true,
  })
  specialInstructions: string;

  @ManyToOne(() => Admin, (Admin: Admin) => Admin.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  admin: string;

  @Column()
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
