import {
  Body,
  Get,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('/current-user')
  getUser(@Request() request) {
    return this.usersService.getUserWithTasks(request.user.email);
  }

  @UseGuards(JwtGuard)
  @Patch('update-password')
  updatePassword(
    @Request() request,
    @Body() { password }: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(request.user.email, password);
  }
}
