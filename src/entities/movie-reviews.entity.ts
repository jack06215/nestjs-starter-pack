import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { MovieReviewRepository } from '@local/movie-reviews/movie-reviews.repository';

import { BaseEntity } from './base.entity';
import { MovieEntity } from './movies.entity';
import { UserEntity } from './users.entity';

@Entity({ tableName: 'movie_reviews', repository: () => MovieReviewRepository })
export class MovieReviewEntity extends BaseEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id: number;

  @Property({
    type: 'real',
    nullable: false,
  })
  rating: number;

  @Property({ type: 'varchar', nullable: true })
  comment: string;

  @ManyToOne({ entity: () => UserEntity })
  user!: UserEntity;

  @ManyToOne({ entity: () => MovieEntity })
  movie!: MovieEntity;

  constructor(param: { rating: number; comment: string }, user: UserEntity, movie: MovieEntity) {
    super();
    this.rating = param.rating;
    this.comment = param.comment;
    this.user = user;
    this.movie = movie;
  }
}
