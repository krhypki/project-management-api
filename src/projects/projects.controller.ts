import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getListOfProjects() {
    return this.projectsService.findAll();
  }

  @Get('/:code')
  getOneByCode(@Param('code') code: string) {
    return this.projectsService.findOne(code);
  }
}
