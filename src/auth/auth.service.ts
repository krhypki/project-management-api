import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PassportPayload } from '../types/PassportPaylod';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email, true);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const { password: pass, ...result } = user;
    return result;
  }

  getPayload(user: User): PassportPayload {
    return {
      email: user.email,
      sub: {
        name: `${user.firstName}  ${user.lastName}`,
      },
    };
  }

  getToken(user: User, config = {}) {
    const payload = this.getPayload(user);
    return this.jwtService.sign(payload, {
      ...config,
      secret: process.env.JWT_SECRET,
    });
  }

  async signin(user: User) {
    return {
      ...user,
      accessToken: this.getToken(user),
      refreshToken: this.getToken(user, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: User) {
    return {
      accessToken: this.getToken(user),
    };
  }

  async signup(user: CreateUserDto) {
    const existingUser = await this.userService.findOneWithEmail(user.email);

    if (existingUser) {
      throw new BadRequestException('email in use');
    }

    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;

    return this.userService.create(user);
  }
}
