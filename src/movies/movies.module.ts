import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieEntity } from '@local/entities/movies.entity';
import { UserMovieEntity } from '@local/entities/user-movies.entity';
import { UserEntity } from '@local/entities/users.entity';
import { UsersService } from '@local/users/users.service';

import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [MikroOrmModule.forFeature([MovieEntity, UserMovieEntity, UserEntity, MovieReviewEntity])],
  providers: [MoviesService, UsersService],
  controllers: [MoviesController],
})
export class MoviesModule {}
