import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsEqualTo } from '../../decorators/is-equal-to';

export class UpdateUserPasswordDto {
  @MinLength(4)
  @IsString()
  password: string;

  @IsEqualTo('password')
  confirmPassword: string;
}
