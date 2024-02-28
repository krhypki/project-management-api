import {
  IsDefined,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../../types/Task';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  desc: string;

  @IsOptional()
  @IsIn(['Created', 'In Progress', 'Done'])
  status: TaskStatus;

  @IsEmail()
  reporter: string;

  @IsEmail()
  assignee: string;

  @IsString()
  project: string;
}
