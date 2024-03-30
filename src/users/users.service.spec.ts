import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '@local/entities/users.entity';
import { MovieReviewRepository } from '@local/movie-reviews/movie-reviews.repository';
import { MovieRepository } from '@local/movies/movies.repository';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;

  let usersRepository: UsersRepository;
  let movieReviewRepository: MovieReviewRepository;
  let movieRepository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    movieReviewRepository = module.get<MovieReviewRepository>(MovieReviewRepository);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'jack',
      password: '<PASSWORD>',
    };
    jest.spyOn(usersRepository, 'createUser').mockResolvedValue({} as UserEntity);
    const result = await service.createUserAccountUsecase(createUserDto);
    expect(result.isSuccess()).toBeTruthy();
  });
});
