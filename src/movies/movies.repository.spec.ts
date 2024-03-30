import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { MovieEntity } from '@local/entities/movies.entity';

import { MovieRepository } from './movies.repository';

describe('MovieRespository', () => {
  let repository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: {
            findById: jest.fn(),
            updateRating: jest.fn(),
            addMovie: jest.fn(),
            findByTitle: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MovieRepository>(getRepositoryToken(MovieEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
