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

// Database Table for Feedback of Rider
@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    nullable: false,
  })
  stars: number;

  @Column({
    default: null,
    nullable: true,
  })
  message: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @ManyToOne(() => Rider, (rider: Rider) => rider.id, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  rider: string;

  @Column()
  riderId: string;

  @Column({
    unique: true,
  })
  orderId: string;

  @Column()
  customerId: string;

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
