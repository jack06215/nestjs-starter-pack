import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { AddMovieReviewBody } from './add-movie-review.dto';

describe('AddMovieReiewReuqestBody', () => {
  it('should create an instance of AddMovieReviewReuqestBody', () => {
    const addMovieReviewBody = plainToInstance(AddMovieReviewBody, {
      userId: uuidv4(),
      movieId: uuidv4(),
      rating: 4,
      comment: 'Awesome movie',
    });
    const errors = validateSync(addMovieReviewBody);
    expect(errors).toHaveLength(0);
  });

  it('should throw error because rating is out of range', () => {
    const addMovieReviewDto = plainToInstance(AddMovieReviewBody, {
      userId: uuidv4(),
      movieId: uuidv4(),
      rating: 6,
      comment: 'Awesome movie',
    });
    const errors = validateSync(addMovieReviewDto);
    expect(errors).toHaveLength(1);
  });
});
