import { EntityRepository } from '@mikro-orm/postgresql';

import { MovieEntity } from '@local/entities/movies.entity';
import { UserMovieEntity } from '@local/entities/user-movies.entity';
import { UserEntity } from '@local/entities/users.entity';

export class UserMovieRepository extends EntityRepository<UserMovieEntity> {
  async findByUserMovieId(userId: string, movieId: string): Promise<UserMovieEntity> {
    const userMovie = await this.findOne({
      user: { id: userId },
      movie: { id: movieId },
    });
    return userMovie;
  }

  async findByUserId(userId: string): Promise<UserMovieEntity[]> {
    const userMovies = await this.find(
      {
        user: { id: userId },
      },
      { populate: ['movie'] },
    );
    return userMovies;
  }

  async createUserMovie(user: UserEntity, movie: MovieEntity): Promise<UserMovieEntity> {
    const newUserMovie = new UserMovieEntity(user, movie);
    await this.getEntityManager().persistAndFlush(newUserMovie);
    return newUserMovie;
  }
}
