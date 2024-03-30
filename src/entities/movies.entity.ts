import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

import { MovieRepository } from '@local/movies/movies.repository';

import { BaseEntity } from './base.entity';
import { MovieReviewEntity } from './movie-reviews.entity';
import { UserMovieEntity } from './user-movies.entity';

@Entity({ tableName: 'movies', repository: () => MovieRepository })
export class MovieEntity extends BaseEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: () => uuidv4(),
    nullable: false,
    comment: 'User ID',
  })
  id: string;

  @Property({
    type: 'varchar',
    nullable: false,
    comment: 'Movie title',
  })
  title: string;

  @Property({
    type: 'varchar',
    nullable: true,
    comment: 'Movie synopsis',
  })
  synopsis: string;

  @Property({
    type: 'float4',
    nullable: false,
    comment: 'Movie rating',
  })
  rating: number;

  @Property({
    name: 'release_date',
    type: 'date',
    nullable: false,
  })
  releaseDate: Date;

  @OneToMany(() => UserMovieEntity, (userMovies) => userMovies.movie)
  favouriteUsers: UserMovieEntity[];

  @OneToMany(() => MovieReviewEntity, (movieReview) => movieReview.movie)
  reviewUsers: MovieReviewEntity[];

  constructor(param: { title: string; releaseDate: Date; synopsis?: string; rating?: number }) {
    super();
    this.id = uuidv4();
    this.title = param.title;
    this.synopsis = param.synopsis;
    this.rating = param.rating;
    this.releaseDate = param.releaseDate;
  }
}
