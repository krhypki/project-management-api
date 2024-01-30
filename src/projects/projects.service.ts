import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(code: string) {
    const project = await this.repo.findOne({
      where: {
        code: ILike(`%${code}%`),
      },
    });

    if (!project) {
      throw new NotFoundException('project not found');
    }

    return project;
  }
}
