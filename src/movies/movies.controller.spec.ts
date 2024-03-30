import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { MovieModel } from '@local/models/movie.model';
import { ResourceNotFound, Success } from '@local/shared/api';
import { JSONResponse } from '@local/shared/response';

import { GetMovieDetailParam } from './dto/get-movie-detail.dto';
import { SearchMoviesQueryParam } from './dto/search-movie.dto';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let movieService: MoviesService;

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
      controllers: [MoviesController],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    movieService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovieDetail should success', () => {
    it('should return a movie detail', async () => {
      const movieId = uuidv4();
      const param = new GetMovieDetailParam();
      param.movieId = movieId;

      const expectedResponse = new MovieModel();
      expectedResponse.id = movieId;
      expectedResponse.title = 'title';
      expectedResponse.synopsis = 'synopsis';
      expectedResponse.rating = 5;
      expectedResponse.releaseDate = new Date();
      const findMovieById = jest.spyOn(movieService, 'getMovieDetailUsecase').mockImplementation(() => {
        return Promise.resolve(new Success(expectedResponse));
      });
      await expect(controller.getMovieDetail({ movieId: param.movieId })).resolves.toEqual(expectedResponse);
      expect(findMovieById).toHaveBeenCalledWith(param);
    });
  });

  describe('getMovieDetail should fail', () => {
    it('should return a movie detail', async () => {
      const movieId = uuidv4();
      const param = new GetMovieDetailParam();
      param.movieId = movieId;

      const findMovieById = jest.spyOn(movieService, 'getMovieDetailUsecase').mockImplementation(() => {
        throw new ResourceNotFound('Movie not found');
      });
      await expect(controller.getMovieDetail({ movieId: param.movieId })).rejects.toThrow(ResourceNotFound);
      expect(findMovieById).toHaveBeenCalledWith(param);
    });
  });

  describe('getMovies should success with search parameter', () => {
    it('should return an empty list', async () => {
      const expectedMovieList = [new MovieModel()];
      const expectedResponse: JSONResponse<MovieModel[]> = {
        content: expectedMovieList,
      };
      const query = new SearchMoviesQueryParam();
      query.search = 'test';
      const findMovieByMatchingTitle = jest.spyOn(movieService, 'searchMovieTitleUsecase').mockImplementation(() => {
        return Promise.resolve(expectedMovieList);
      });
      await expect(controller.getMovies(query)).resolves.toEqual(expectedResponse);
      expect(findMovieByMatchingTitle).toHaveBeenCalled();
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
      const searchQuery = new SearchMoviesQueryParam();
      searchQuery.search = 'title';
      const expectedResponse: JSONResponse<MovieModel[]> = {
        content: expectedMovieList,
      };
      const findMovieByMatchingTitle = jest.spyOn(movieService, 'searchMovieTitleUsecase').mockImplementation(() => {
        return Promise.resolve(expectedMovieList);
      });
      await expect(controller.getMovies(searchQuery)).resolves.toEqual(expectedResponse);
      expect(findMovieByMatchingTitle).toHaveBeenCalled();
    });
  });
  describe('getMovies should success', () => {
    it('should return an empty list', async () => {
      const expectedMovieList = [new MovieModel()];
      const expectedResponse: JSONResponse<MovieModel[]> = {
        content: expectedMovieList,
      };
      const findPopularMoviesMonthly = jest
        .spyOn(movieService, 'findPopularMoviesMonthlyUsacase')
        .mockImplementation(() => {
          return Promise.resolve(expectedMovieList);
        });
      await expect(controller.getMovies(new SearchMoviesQueryParam())).resolves.toEqual(expectedResponse);
      expect(findPopularMoviesMonthly).toHaveBeenCalled();
    });
    it('should return a list of popular movies', async () => {
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
      const findPopularMoviesMonthly = jest
        .spyOn(movieService, 'findPopularMoviesMonthlyUsacase')
        .mockImplementation(() => {
          return Promise.resolve(expectedMovieList);
        });
      await expect(controller.getMovies(new SearchMoviesQueryParam())).resolves.toEqual(expectedResponse);
      expect(findPopularMoviesMonthly).toHaveBeenCalled();
    });
  });
});
