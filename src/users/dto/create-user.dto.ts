import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsEqualTo } from '../../decorators/is-equal-to';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  @IsString()
  password: string;

  @IsEqualTo('password')
  confirmPassword: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
