import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from '@local/entities/users.entity';
import { Success } from '@local/shared/api';
import { CreateUserSuccess } from '@local/users/response';
import { UsersService } from '@local/users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUserAccountUsecase: jest.fn(),
            upsertMovieReviewUsecase: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            signInUsecase: jest.fn(),
            validateUserUsecase: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp should success', () => {
    it('should return a success message', async () => {
      const userId = uuidv4();
      const exptectedResponse: CreateUserSuccess = {
        id: userId,
      };
      const createUser = jest.spyOn(usersService, 'createUserAccountUsecase').mockImplementation(() => {
        return Promise.resolve(new Success(exptectedResponse));
      });
      await expect(controller.signUp({ username: 'test', password: '<PASSWORD>' })).resolves.toEqual(exptectedResponse);
      expect(createUser).toHaveBeenCalledWith({ username: 'test', password: '<PASSWORD>' });
    });
  });
  describe('signIn should success', () => {
    it('should return a success message', async () => {
      const accessToken = 'MockAccessToken';
      const user = new UserEntity({ username: 'test', password: 'password' }, [], []);
      user.validatePassword = jest.fn().mockResolvedValue(true);
      jest.spyOn(authService, 'signInUsecase').mockResolvedValue({ access_token: accessToken });
      await expect(controller.signIn({ username: 'test', password: '<PASSWORD>' })).resolves.toEqual({
        access_token: accessToken,
      });
    });
  });
});
