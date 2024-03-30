import { UserEntity } from './users.entity';

describe('UserMovieEntity', () => {
  it('should create an instance of UserMovieEntity', () => {
    const user = new UserEntity({ username: 'testUser', password: 'password' }, [], []);
    expect(user.username).toBe('testUser');
    expect(user.password).toBe('password');
  });
});
