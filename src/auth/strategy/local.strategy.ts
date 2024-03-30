import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@local/auth/auth.service';
import { UserEntity } from '@local/entities/users.entity';

import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'username' });
    this.logger.warn('LocalStrategy initialized');
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUserUsecase(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
