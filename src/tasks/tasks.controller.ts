import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post()
  saveTask(@Body() body: CreateTaskDto) {
    return this.tasksService.saveTask(body);
  }

  @Patch('/:code')
  updateTask(@Param('code') code: string, @Body() body: any) {
    return this.tasksService.updateTask(code, body);
  }

  @Get('/:code')
  getTask(@Param('code') code: string) {
    return this.tasksService.findOne(code);
  }

  @Get()
  getAllTasks() {
    return this.tasksService.findAll();
  }
}
