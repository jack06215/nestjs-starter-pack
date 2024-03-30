import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieEntity } from '@local/entities/movies.entity';
import { UserEntity } from '@local/entities/users.entity';
import { UsersModule } from '@local/users/users.module';
import { UsersService } from '@local/users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MikroOrmModule.forFeature([UserEntity, MovieEntity, MovieReviewEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
