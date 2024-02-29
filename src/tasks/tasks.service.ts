import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async saveTask(body: CreateTaskDto) {
    interface RelationsCreateData {
      project: Project;
      assignee: User;
      reporter: User;
    }

    const relationsData = await this.getRelations<RelationsCreateData>(body);
    const code = this.getTaskCode(relationsData.project);
    const task = this.repo.create({
      ...body,
      ...relationsData,
      code,
    });

    await this.repo.save(task);
    return { ...body, code };
  }

  async updateTask(code: string, body: any) {
    interface RelationsUpdateData {
      project?: Project;
      assignee?: User;
      reporter?: User;
    }

    const task = await this.repo.findOne({
      where: {
        code: ILike(`%${code}%`),
      },
    });

    if (!task) {
      throw new NotFoundException('task not found');
    }

    const relationsData = await this.getRelations<RelationsUpdateData>(body);

    if (body.project) {
      code = this.getTaskCode(relationsData.project);
    }

    const updatedTask = this.repo.create({
      ...task,
      ...relationsData,
      code,
    });

    await this.repo.save(updatedTask);

    return { ...body, code };
  }

  getTaskCode(project: Project) {
    return project.code + (project.tasks?.length + 1 || 1);
  }

  async getRelations<T>(body: any, findProjectWithTasks = false): Promise<T> {
    const relations = {
      reporter: () => this.usersService.findOneWithEmail(body.reporter),
      assignee: () => this.usersService.findOneWithEmail(body.assignee),
      project: () =>
        this.projectsService.findOne(body.project, {
          relations: { tasks: findProjectWithTasks },
        }),
    };

    const keys = Object.keys(body);

    const result = await Promise.all(
      keys.map(async (key) => {
        if (relations[key]) {
          const value = await relations[key]();
          return {
            [key]: value,
          };
        }
      }),
    );

    return result.reduce((obj, item) => {
      if (item) {
        const key = Object.keys(item)[0];
        obj[key] = item[key];
      }
      return obj;
    }, {}) as T;
  }

  async findOne(code: string) {
    const task = await this.repo.findOne({
      where: {
        code: ILike(`%${code}%`),
      },
    });

    return task;
  }
}
