import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { type TaskStatus } from '../types/Task';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ default: 'Created' })
  status: TaskStatus;

  @Column({ nullable: true })
  desc: string;

  @ManyToOne(() => User, (user) => user.reportedTasks, { eager: true })
  reporter: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, { eager: true })
  assignee: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;
}
