import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { CurrentUserInterceptor } from '@local/auth/interceptor/current-user.interceptor';
import { UserEntity } from '@local/entities/users.entity';
import { MovieModel } from '@local/models/movie.model';
import { MoviesService } from '@local/movies/movies.service';
import { JSONResponse, SimpleResponse } from '@local/shared/response';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MoviesService,
          useValue: {
            addMovieUsecase: jest.fn(),
            searchMovieTitleUsecase: jest.fn(),
            findPopularMoviesMonthlyUsacase: jest.fn(),
            getMovieDetailUsecase: jest.fn(),
            addUserMovieUsecase: jest.fn(),
            findUserFavouriteMovies: jest.fn(),
          },
        },
      ],
      controllers: [UsersController],
    })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFavouriteMovies should success', () => {
    it('should return an empty list', async () => {
      const expectedMovieList = [new MovieModel()];
      const expectedResponse: JSONResponse<MovieModel[]> = {
        content: expectedMovieList,
      };
      const findUserFavouriteMovies = jest.spyOn(moviesService, 'findUserFavouriteMovies').mockImplementation(() => {
        return Promise.resolve(expectedMovieList);
      });
      const user = new UserEntity({ username: 'username', password: 'password' }, [], []);
      await expect(controller.getFavouriteMovies(user)).resolves.toEqual(expectedResponse);
      expect(findUserFavouriteMovies).toHaveBeenCalled();
    });
    it('should return a list of movies', async () => {
      const expectedMovieList: MovieModel[] = [
        {
          id: uuidv4(),
          title: 'title',
          synopsis: 'synopsis',
          rating: 5,
          releaseDate: new Date(),
        },
      ];
      const expectedResponse: JSONResponse<MovieModel[]> = {
        content: expectedMovieList,
      };
      const findUserFavouriteMovies = jest.spyOn(moviesService, 'findUserFavouriteMovies').mockImplementation(() => {
        return Promise.resolve(expectedMovieList);
      });
      const user = new UserEntity({ username: 'username', password: 'password' }, [], []);
      await expect(controller.getFavouriteMovies(user)).resolves.toEqual(expectedResponse);
      expect(findUserFavouriteMovies).toHaveBeenCalled();
    });
  });

  describe('addFavouriteMovie should success', () => {
    it('should return an empty list', async () => {
      const user = new UserEntity({ username: 'username', password: 'password' }, [], []);
      const addUserMovie = jest
        .spyOn(moviesService, 'addUserMovieUsecase')
        .mockImplementation(() => Promise.resolve(true));
      const expectedResponse: SimpleResponse = {
        message: 'ok',
      };
      await expect(controller.addFavouriteMovie(uuidv4(), user)).resolves.toEqual(expectedResponse);
      expect(addUserMovie).toHaveBeenCalled();
    });
  });

  describe('addFavouriteMovie should success', () => {
    it('should return a success message since addUserMovie return true', async () => {
      const user = new UserEntity({ username: 'username', password: 'password' }, [], []);
      const addUserMovie = jest
        .spyOn(moviesService, 'addUserMovieUsecase')
        .mockImplementation(() => Promise.resolve(true));
      const expectedResponse: SimpleResponse = {
        message: 'ok',
      };
      await expect(controller.addFavouriteMovie(uuidv4(), user)).resolves.toEqual(expectedResponse);
      expect(addUserMovie).toHaveBeenCalled();
    });
    it('should return an error message since addUserMovie return false', async () => {
      const user = new UserEntity({ username: 'username', password: 'password' }, [], []);
      const addUserMovie = jest
        .spyOn(moviesService, 'addUserMovieUsecase')
        .mockImplementation(() => Promise.resolve(false));
      await expect(controller.addFavouriteMovie(uuidv4(), user)).rejects.toEqual(
        new NotFoundException('Cannot add favourite movie'),
      );
      expect(addUserMovie).toHaveBeenCalled();
    });
  });
});
