import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from '@local/entities/users.entity';

import { UsersRepository } from './users.repository';

function userList() {
  const user1 = new UserEntity({ username: 'user1', password: 'password' }, [], []);
  const user2 = new UserEntity({ username: 'user2', password: 'password' }, [], []);
  const user3 = new UserEntity({ username: 'user3', password: 'password' }, [], []);
  user1.id = uuidv4();
  user2.id = uuidv4();
  user3.id = uuidv4();
  return [user1, user2, user3];
}

describe('UserRepository', () => {
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findByUsername: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();
    userRepository = module.get<UsersRepository>(getRepositoryToken(UserEntity));
  });

  it('should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  it('findByUsername should return a user', async () => {
    const user = userList()[0];
    jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);
    const result = await userRepository.findByUsername(user.username);
    expect(result).toEqual(user);
  });
});
