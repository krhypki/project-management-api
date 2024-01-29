import {
  Body,
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

  @UseGuards(JwtGuard)
  @Patch('update-password')
  updatePassword(
    @Request() request,
    @Body() { password }: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(request.user.email, password);
  }
}
