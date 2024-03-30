import { Injectable } from '@nestjs/common';

import { AddMovieReviewDto } from '@local/movie-reviews/dto/add-movie-review.dto';
import { MovieReviewRepository } from '@local/movie-reviews/movie-reviews.repository';
import { MovieRepository } from '@local/movies/movies.repository';
import { BaseError, Failure, ResourceNotFound, Result, Success } from '@local/shared/api';

import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserSuccess } from './response';
import { UsersRepository } from './users.repository';

type UpsertMovieReviewError = ResourceNotFound | BaseError;
type CreateUserError = ResourceNotFound | BaseError;

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly movieReviewRepository: MovieReviewRepository,
    private readonly movieRepository: MovieRepository,
  ) {}

  /**
   * @description Create a new user account
   *
   * @param registerUserDto: User to create
   */
  async createUserAccountUsecase(
    registerUserDto: RegisterUserDto,
  ): Promise<Result<CreateUserSuccess, CreateUserError>> {
    const { username, password } = registerUserDto;

    const found = await this.userRepository.findByUsername(username);
    if (found) {
      return new Failure(new ResourceNotFound('Username already exists'));
    }

    const user = await this.userRepository.createUser(username, password);
    return new Success({
      id: user.id,
    });
  }

  async upsertMovieReviewUsecase(addMovieReview: AddMovieReviewDto): Promise<Result<boolean, UpsertMovieReviewError>> {
    const user = await this.userRepository.findById(addMovieReview.userId);
    if (!user) {
      return new Failure(new ResourceNotFound('User not found'));
    }

    const movie = await this.movieRepository.findById(addMovieReview.movieId);
    if (!movie) {
      return new Failure(new ResourceNotFound('Movie not found'));
    }

    const movieReviewRecord = await this.movieReviewRepository.findByUserMovieId(user.id, movie.id);
    if (movieReviewRecord) {
      await this.movieReviewRepository.updateReview(movieReviewRecord, {
        rating: addMovieReview.rating,
        comment: addMovieReview.comment,
      });
    } else {
      await this.movieReviewRepository.addReview(movie, user, {
        rating: addMovieReview.rating,
        comment: addMovieReview.comment,
      });
    }
    const newAverageRating = await this.movieReviewRepository.calculateAverageRating(movie);
    await this.movieRepository.updateRating(movie, newAverageRating);
    return new Success(true);
  }
}
