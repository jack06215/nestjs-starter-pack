import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieEntity } from '@local/entities/movies.entity';
import { UserMovieEntity } from '@local/entities/user-movies.entity';
import { UserEntity } from '@local/entities/users.entity';
import { MoviesService } from '@local/movies/movies.service';
import { UsersService } from '@local/users/users.service';

import { MovieReviewsController } from './movie-reviews.controller';

@Module({
  imports: [MikroOrmModule.forFeature([MovieEntity, UserMovieEntity, UserEntity, MovieReviewEntity])],
  providers: [MoviesService, UsersService],
  controllers: [MovieReviewsController],
})
export class MovieReviewsModule {}
