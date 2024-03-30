import { sql } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { format, lastDayOfMonth, parse } from 'date-fns';

import { MovieReviewEntity } from '@local/entities/movie-reviews.entity';
import { MovieModel, convertMovieToModel } from '@local/models/movie.model';
import { MovieReviewRepository } from '@local/movie-reviews/movie-reviews.repository';
import { Failure, ResourceNotFound, Result, Success } from '@local/shared/api';
import { UserMovieRepository } from '@local/user-movies/user-movies.repository';
import { UsersRepository } from '@local/users/users.repository';

import { AddMovieRequestBody } from './dto/add-movie.dto';
import { AddUserMovieDto } from './dto/add-user-movie.dto';
import { GetMovieDetailParam } from './dto/get-movie-detail.dto';
import { MovieRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly userRepository: UsersRepository,
    private readonly userMovieRepository: UserMovieRepository,
    private readonly movieReviewRepository: MovieReviewRepository,
  ) {}

  /**
   *
   * @param param Input parameters for adding a movie
   * @returns Movie UUID
   */
  async addMovieUsecase(param: AddMovieRequestBody): Promise<Pick<MovieModel, 'id'>> {
    const { title, synopsis, releaseDate } = param;
    const res = await this.movieRepository.addMovie(title, releaseDate, synopsis);
    return { id: res.id };
  }

  /**
   * @description Returns a list of movie titles that partially match the title search term
   * @param title Title search term
   * @returns List of movies
   */
  async searchMovieTitleUsecase(title: string): Promise<MovieModel[]> {
    const res = await this.movieRepository.findByTitle(title);
    return res.map((m) => convertMovieToModel(m));
  }

  /**
   * @description Returns a list of popular movies for the given month
   * @param monthly Monthly string such as '202003' representing the year and month
   * @returns List of popular movies for the given month
   */
  async findPopularMoviesMonthlyUsacase(monthly: string): Promise<MovieModel[]> {
    const date = parse(monthly, 'yyyyMM', new Date());
    const firstDateOfMonth = format(date, 'yyyy-MM-01');
    const lastDateOfMonth = format(lastDayOfMonth(firstDateOfMonth), 'yyyy-MM-dd');
    const topMovieReviewsQuery = this.movieReviewRepository
      .qb()
      .select(['movie_id', sql`COUNT(movie_id) num_comments`, sql`AVG(rating) avg_rating`])
      .from(MovieReviewEntity)
      .groupBy('movie_id')
      .limit(100);
    const topMovieReviews = await this.movieReviewRepository
      .getEntityManager()
      .getConnection()
      .execute(topMovieReviewsQuery.getKnexQuery());
    const topMovies = await this.movieRepository.find({
      releaseDate: {
        $gt: firstDateOfMonth,
        $lt: lastDateOfMonth,
      },
      id: {
        $in: topMovieReviews.map((r) => r.movie_id),
      },
    });
    return topMovies.map((m) => convertMovieToModel(m));
  }

  /**
   * @description Find a movie by movie UUID
   * @param id Movie UUID
   * @returns Movie
   */
  async getMovieDetailUsecase(param: GetMovieDetailParam): Promise<Result<MovieModel, ResourceNotFound>> {
    const res = await this.movieRepository.findById(param.movieId);
    if (res) {
      return new Success(convertMovieToModel(res));
    }
    return new Failure(new ResourceNotFound('Movie not found'));
  }

  /**
   * @description Add a favourite movie
   * @param addUserMovieDto Input parameters for adding a favourite movie
   * @returns true if succes, else throws exception
   */
  async addUserMovieUsecase(addUserMovieDto: AddUserMovieDto): Promise<boolean> {
    const { userId, movieId } = addUserMovieDto;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }
    const movie = await this.movieRepository.findById(movieId);
    if (!movie) {
      return false;
    }
    const userMovie = await this.userMovieRepository.findByUserMovieId(userId, movieId);
    if (userMovie) {
      return true;
    }
    await this.userMovieRepository.createUserMovie(user, movie);
    return true;
  }

  /**
   * @description Get a list of user's favorite movies
   * @param userId User UUID
   * @returns List of user's favorite movies
   */
  async findUserFavouriteMovies(userId: string): Promise<MovieModel[]> {
    const userMovies = await this.userMovieRepository.findByUserId(userId);
    return userMovies.map((m) => convertMovieToModel(m.movie));
  }
}
