import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findOneWithEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async updatePassword(email: string, password: string) {
    const user = await this.findOneWithEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.password = await bcrypt.hash(password, 10);
    return this.repo.save(user);
  }
}
