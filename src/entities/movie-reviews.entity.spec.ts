import { MovieReviewEntity } from './movie-reviews.entity';
import { MovieEntity } from './movies.entity';
import { UserEntity } from './users.entity';

describe('MovieReviewEntity', () => {
  it('should create an instance of MovieReviewEntiry', () => {
    const movie = new MovieEntity({ title: 'test', releaseDate: new Date() });
    const user = new UserEntity({ username: 'test', password: 'password' }, [], []);
    const movieReview = new MovieReviewEntity({ rating: 5, comment: 'test' }, user, movie);
    expect(movieReview.comment).toBe('test');
    expect(movieReview.rating).toBe(5);
    expect(movieReview.user).toBe(user);
    expect(movieReview.movie).toBe(movie);
  });
});
