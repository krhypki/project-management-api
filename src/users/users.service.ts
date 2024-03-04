import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findOneWithEmail(email: string, selectPassword = false) {
    const user = await this.dataSource
      .createQueryBuilder(User, 'user')
      .select('user')
      .where('user.email = :email', { email })
      .addSelect(selectPassword ? 'user.password' : '')
      .getOne();

    return user;
  }

  async getUserWithTasks(email: string) {
    const user = await this.repo.findOne({
      where: { email },
      relations: ['reportedTasks', 'assignedTasks'],
    });

    return user;
  }

  async findAll() {
    const users = await this.repo.find({
      select: ['email'],
    });

    return users.map((user) => {
      return user.email;
    });
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
