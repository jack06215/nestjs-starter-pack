import { EntityRepository, sql } from '@mikro-orm/postgresql';
import { parse } from 'date-fns';

import { MovieEntity } from '@local/entities/movies.entity';
import { MovieModel } from '@local/models/movie.model';

export class MovieRepository extends EntityRepository<MovieEntity> {
  async findById(id: string): Promise<MovieEntity> {
    const movie = await this.findOne({ id });
    return movie;
  }

  async updateRating(movie: MovieEntity, rating: number): Promise<void> {
    this.assign(movie, { rating }, { mergeObjectProperties: true });
    await this.getEntityManager().flush();
  }

  async addMovie(title: string, releaseDate: string, synopsis?: string): Promise<MovieModel> {
    const movie = new MovieEntity({
      title,
      synopsis: synopsis || 'No description',
      rating: 0,
      releaseDate: parse(releaseDate, 'yyyy-MM-dd', new Date()),
    });
    await this.getEntityManager().persistAndFlush(movie);
    return movie;
  }

  async findByTitle(title: string): Promise<MovieEntity[]> {
    const res = await this.find({
      [sql.lower('title')]: {
        $like: `%${title.toLowerCase()}%`,
      },
    });
    return res;
  }
}
