import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUserInterceptor } from '@local/auth/interceptor/current-user.interceptor';
import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieEntity } from '@local/entities/movies.entity';
import { UserMovieEntity } from '@local/entities/user-movies.entity';
import { UserEntity } from '@local/entities/users.entity';
import { MoviesService } from '@local/movies/movies.service';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([MovieEntity, UserMovieEntity, UserEntity, MovieReviewEntity])],
  providers: [JwtService, UsersService, MoviesService, CurrentUserInterceptor],
  controllers: [UsersController],
})
export class UsersModule {}
