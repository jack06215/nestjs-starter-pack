import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '@local/auth/jwt-payload.interface';
import { UserEntity } from '@local/entities/users.entity';
import { UsersRepository } from '@local/users/users.repository';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
    this.logger.warn('JwtRefreshTokenStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`);
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
