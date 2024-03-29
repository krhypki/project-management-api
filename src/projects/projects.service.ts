import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { FindOneOptions, ILike, Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: {
        owner: true,
      },
    });
  }

  async findOne(code: string, config?: Partial<FindOneOptions<Project>>) {
    const project = await this.repo.findOne({
      where: {
        code: ILike(`%${code}%`),
      },
      relations: ['owner', 'tasks', 'tasks.reporter', 'tasks.assignee'],
    });

    if (!project) {
      throw new NotFoundException('project not found');
    }

    return project;
  }
}
