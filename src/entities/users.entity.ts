import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { UsersRepository } from '@local/users/users.repository';

import { BaseEntity } from './base.entity';
import { MovieReviewEntity } from './movie-reviews.entity';
import { UserMovieEntity } from './user-movies.entity';

@Entity({ tableName: 'users', repository: () => UsersRepository })
export class UserEntity extends BaseEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: () => uuidv4(),
    nullable: false,
    comment: 'User ID',
  })
  id: string;

  @Property({ type: 'varchar', length: 128, nullable: false, comment: 'Username' })
  username: string;

  @Property({ type: 'varchar', hidden: true, comment: 'User password' })
  password: string;

  @OneToMany(() => UserMovieEntity, (userMovies) => userMovies.user)
  favouriteMovies = new Collection<UserMovieEntity>(this);

  @OneToMany(() => MovieReviewEntity, (movieReview) => movieReview.user)
  reviewedMovies = new Collection<MovieReviewEntity>(this);

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  constructor(
    param: { username: string; password: string },
    favouriteMovies: UserMovieEntity[],
    reviewedMovies: MovieReviewEntity[],
  ) {
    super();
    this.username = param.username;
    this.password = param.password;
    this.favouriteMovies = new Collection(this, favouriteMovies);
    this.reviewedMovies = new Collection(this, reviewedMovies);
  }
}
