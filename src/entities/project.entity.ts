import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ unique: true, nullable: false })
  code: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
