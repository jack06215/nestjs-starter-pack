import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { CurrentUserInterceptor } from '@local/auth/interceptor/current-user.interceptor';
import { UserEntity } from '@local/entities/users.entity';
import { ResourceNotFound, Success } from '@local/shared/api';
import { SimpleResponse } from '@local/shared/response';
import { UsersService } from '@local/users/users.service';

import { AddMovieReviewBody, AddMovieReviewDto } from './dto/add-movie-review.dto';
import { MovieReviewsController } from './movie-reviews.controller';

describe('MovieReviewsController', () => {
  let controller: MovieReviewsController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            upsertMovieReviewUsecase: jest.fn(),
          },
        },
      ],
      controllers: [MovieReviewsController],
    })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({})
      .compile();

    controller = module.get<MovieReviewsController>(MovieReviewsController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMovieReview should success', () => {
    it('should return a success message', async () => {
      const userId = uuidv4();
      const movieId = uuidv4();
      const user = new UserEntity({ username: 'test', password: 'test' }, [], []);
      user.id = userId;
      const addMovieReviewBody: AddMovieReviewBody = {
        rating: 5,
        comment: 'Awesome movie',
      };
      const upsertMovieReview = jest.spyOn(usersService, 'upsertMovieReviewUsecase').mockImplementation(() => {
        return Promise.resolve(new Success(true));
      });
      const expectedResponse: SimpleResponse = {
        message: 'ok',
      };
      await expect(controller.addMovieReview(user, movieId, addMovieReviewBody)).resolves.toEqual(expectedResponse);
      expect(upsertMovieReview).toHaveBeenCalled();
    });
  });

  describe('addMovieReview should fail', () => {
    it('user id not found', async () => {
      const userId = uuidv4();
      const movieId = uuidv4();
      const user = new UserEntity({ username: 'test', password: 'test' }, [], []);
      user.id = userId;
      const addMovieReviewDto: AddMovieReviewDto = {
        userId: uuidv4(),
        movieId,
        rating: 5,
        comment: 'Awesome movie',
      };
      const upsertMovieReview = jest.spyOn(usersService, 'upsertMovieReviewUsecase').mockImplementation(() => {
        throw new ResourceNotFound('User not found');
      });
      await expect(controller.addMovieReview(user, movieId, addMovieReviewDto)).rejects.toThrow(ResourceNotFound);
      expect(upsertMovieReview).toHaveBeenCalled();
    });
    it('movie id not found', async () => {
      const userId = uuidv4();
      const movieId = uuidv4();
      const user = new UserEntity({ username: 'test', password: 'test' }, [], []);
      user.id = userId;
      const addMovieReviewDto: AddMovieReviewDto = {
        userId,
        movieId: uuidv4(),
        rating: 5,
        comment: 'Awesome movie',
      };
      const upsertMovieReview = jest.spyOn(usersService, 'upsertMovieReviewUsecase').mockImplementation(() => {
        throw new ResourceNotFound('Movie not found');
      });
      await expect(controller.addMovieReview(user, movieId, addMovieReviewDto)).rejects.toThrow(ResourceNotFound);
      expect(upsertMovieReview).toHaveBeenCalled();
    });
  });
});
