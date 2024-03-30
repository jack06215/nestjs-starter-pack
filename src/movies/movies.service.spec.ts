import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { MovieReviewRepository } from '@local/movie-reviews/movie-reviews.repository';
import { UserMovieRepository } from '@local/user-movies/user-movies.repository';
import { UsersRepository } from '@local/users/users.repository';

import { AddMovieRequestBody } from './dto/add-movie.dto';
import { MovieRepository } from './movies.repository';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  let usersRepository: UsersRepository;
  let userMovieRepository: UserMovieRepository;
  let movieRepository: MovieRepository;
  let movieReviewRepository: MovieReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: UsersRepository,
          useValue: {
            findByUsername: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: MovieReviewRepository,
          useValue: {
            findByMovieId: jest.fn(),
            findByUserId: jest.fn(),
            findByUserMovieId: jest.fn(),
            addReview: jest.fn(),
            updateReview: jest.fn(),
            calculateAverageRating: jest.fn(),
          },
        },
        {
          provide: UserMovieRepository,
          useValue: {
            findByUserMovieId: jest.fn(),
            findByUserId: jest.fn(),
            createUserMovie: jest.fn(),
          },
        },
        {
          provide: MovieRepository,
          useValue: {
            findById: jest.fn(),
            updateRating: jest.fn(),
            addMovie: jest.fn(),
            findByTitle: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    userMovieRepository = module.get<UserMovieRepository>(UserMovieRepository);
    movieReviewRepository = module.get<MovieReviewRepository>(MovieReviewRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new movie', async () => {
    const newMovie: AddMovieRequestBody = {
      title: 'test',
      releaseDate: '2020-01-01',
      synopsis: 'test',
    };
    const id = uuidv4();
    jest
      .spyOn(movieRepository, 'addMovie')
      .mockResolvedValue({
        id: id,
        title: newMovie.title,
        synopsis: newMovie.synopsis,
        rating: 0,
        releaseDate: new Date(),
      });
    const result = await service.addMovieUsecase(newMovie);
    expect(result).toEqual({ id: id });
  });
});
