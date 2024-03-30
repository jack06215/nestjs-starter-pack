import { MovieEntity } from './movies.entity';
import { UserMovieEntity } from './user-movies.entity';
import { UserEntity } from './users.entity';

describe('UserMovieEntity', () => {
  it('should create an instance of UserMovieEntity', () => {
    const user = new UserEntity({ username: 'testUser', password: 'password' }, [], []);
    const movie = new MovieEntity({ title: 'testMovie', releaseDate: new Date() });
    const userMovie = new UserMovieEntity(user, movie);
    expect(userMovie.movie.title).toBe('testMovie');
    expect(userMovie.user.username).toBe('testUser');
  });
});
