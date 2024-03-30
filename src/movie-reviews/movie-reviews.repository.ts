import { EntityRepository, sql } from '@mikro-orm/postgresql';

import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieEntity } from '@local/entities/movies.entity';
import { UserEntity } from '@local/entities/users.entity';

export class MovieReviewRepository extends EntityRepository<MovieReviewEntity> {
  async findByMovieId(id: string): Promise<MovieReviewEntity[]> {
    const movieReview = await this.find({ movie: { id } });
    return movieReview;
  }

  async findByUserId(id: string): Promise<MovieReviewEntity[]> {
    const movieReview = await this.find({ user: { id } });
    return movieReview;
  }

  async findByUserMovieId(userId: string, movieId: string): Promise<MovieReviewEntity> {
    const movieReview = await this.findOne({
      user: { id: userId },
      movie: { id: movieId },
    });
    return movieReview;
  }

  async addReview(
    movie: MovieEntity,
    user: UserEntity,
    param: { rating: number; comment: string },
  ): Promise<MovieReviewEntity> {
    const newMovieReview = new MovieReviewEntity(param, user, movie);
    await this.getEntityManager().persistAndFlush(newMovieReview);
    return newMovieReview;
  }

  async updateReview(
    movieReview: MovieReviewEntity,
    param: { rating?: number; comment?: string },
  ): Promise<MovieReviewEntity> {
    this.assign(
      movieReview,
      { rating: param.rating || movieReview.rating, comment: param.comment || movieReview.comment },
      { mergeObjectProperties: true },
    );
    await this.getEntityManager().flush();
    return movieReview;
  }

  async calculateAverageRating(movie: MovieEntity): Promise<number> {
    const query = this.qb()
      .select(sql`AVG(rating)::real as average`)
      .from(MovieReviewEntity)
      .where({ movie })
      .getKnexQuery();
    const newAverage: { average: number }[] = await this.getEntityManager().getConnection().execute(query);

    return newAverage[0].average;
  }
}
