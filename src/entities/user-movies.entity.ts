import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { UserMovieRepository } from '@local/user-movies/user-movies.repository';

import { BaseEntity } from './base.entity';
import { MovieEntity } from './movies.entity';
import { UserEntity } from './users.entity';

@Entity({ tableName: 'user_movies', repository: () => UserMovieRepository })
export class UserMovieEntity extends BaseEntity {
  @PrimaryKey({ type: 'int', autoincrement: true })
  id: number;

  @ManyToOne({ entity: () => UserEntity })
  user!: UserEntity;

  @ManyToOne({ entity: () => MovieEntity })
  movie!: MovieEntity;

  constructor(user: UserEntity, movie: MovieEntity) {
    super();
    this.user = user;
    this.movie = movie;
  }
}
