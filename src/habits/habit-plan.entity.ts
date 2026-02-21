import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Habit } from './habit.entity.js';

@Entity('habit_plans')
export class HabitPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  targetValue: number;

  @Column({ type: 'float', default: 0 })
  actualValue: number;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Habit, (habit) => habit.plans, { onDelete: 'CASCADE' })
  habit: Habit;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
