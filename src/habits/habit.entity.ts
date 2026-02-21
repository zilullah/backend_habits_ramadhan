import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { HabitPlan } from './habit-plan.entity.js';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  totalTarget: number;

  @Column()
  targetUnit: string;

  @Column({ type: 'int' })
  durationDays: number;

  @Column({ type: 'date' })
  startDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => HabitPlan, (plan) => plan.habit, { cascade: true })
  plans: HabitPlan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
