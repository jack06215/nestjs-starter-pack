import { MovieEntity } from './movies.entity';

describe('MovieEntity', () => {
  it('should create an instance of MovieEntity', () => {
    const movie = new MovieEntity({ title: 'test', releaseDate: new Date() });
    expect(movie.title).toBe('test');
    expect(movie.releaseDate).toBeInstanceOf(Date);
  });
});
