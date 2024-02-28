import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Task, (task) => task.reporter, { nullable: true })
  @JoinColumn({ name: 'reporter' })
  reportedTasks?: Task[];

  @OneToMany(() => Task, (task) => task.assignee, { nullable: true })
  @JoinColumn({ name: 'assignee' })
  assignedTasks?: Task[];
}
