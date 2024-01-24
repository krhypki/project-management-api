import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportPayload } from '../../types/PassportPaylod';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
      usernameField: 'email',
    });
  }

  async validate(payload: PassportPayload) {
    return {
      user: payload.sub,
      email: payload.email,
    };
  }
}
