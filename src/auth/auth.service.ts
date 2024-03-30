import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '@local/entities/users.entity';
import { UsersRepository } from '@local/users/users.repository';

import { SignInDto } from './dto/sign-in.dto';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async signInUsecase(signInDto: SignInDto) {
    const user = await this.validateUserUsecase(signInDto.username, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  async validateUserUsecase(username: string, password: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findByUsername(username);
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
