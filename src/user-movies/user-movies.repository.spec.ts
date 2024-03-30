import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { UserMovieEntity } from '@local/entities/user-movies.entity';

import { UserMovieRepository } from './user-movies.repository';

describe('UserMoviesRepository', () => {
  let userMoviesRepository: UserMovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserMovieEntity),
          useValue: {
            findByUserMovieId: jest.fn(),
            findByUserId: jest.fn(),
            createUserMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    userMoviesRepository = module.get<UserMovieRepository>(getRepositoryToken(UserMovieEntity));
  });

  it('should be defined', () => {
    expect(userMoviesRepository).toBeDefined();
  });
});
