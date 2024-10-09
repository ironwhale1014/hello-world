import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

export class LocalAuthGuard extends AuthGuard('codefactory') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'codefactory') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return await this.authService.authenticate(email, password);
  }
}
