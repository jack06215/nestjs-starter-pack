import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Length, Max, Min } from 'class-validator';

export const COMMENT_MIN_LENGTH = 10;
export const COMMENT_MAX_LENGTH = 5000;
export const RATING_MIN_VALUE = 1;
export const RATING_MAX_VALUE = 5;

export class AddMovieReviewParam {
  @ApiProperty({
    name: 'movieId',
    description: 'Movie ID',
    example: '3c69c295-fa35-495c-a991-06b1eb666e46',
  })
  @IsUUID('4')
  movieId: string;
}

export class AddMovieReviewBody {
  @ApiProperty({
    type: 'number',
    description: 'Rating of the movie review, 1 to 5',
    example: 4,
    minimum: RATING_MIN_VALUE,
    maximum: RATING_MAX_VALUE,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(RATING_MIN_VALUE)
  @Max(RATING_MAX_VALUE)
  rating: number;

  @ApiProperty({
    type: 'string',
    description: 'Comment of the movie review',
    example: 'Awesome movie',
    minLength: COMMENT_MIN_LENGTH,
    maxLength: COMMENT_MAX_LENGTH,
  })
  @Length(COMMENT_MIN_LENGTH, COMMENT_MAX_LENGTH)
  comment?: string;
}

/**
 * @description Add movie review
 */
export class AddMovieReviewDto {
  userId: string;
  movieId: string;
  rating: number;
  comment?: string;
}
