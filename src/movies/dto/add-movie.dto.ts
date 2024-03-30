import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, MaxLength, MinLength } from 'class-validator';

export const TITLE_MIN_LENGTH = 1;
export const SYNOPOSIS_MAX_LENGTH = 1000;

/**
 * @description Add movie review input parameters
 */
export class AddMovieRequestBody {
  @ApiProperty({
    type: 'string',
    description: 'Title of the movie',
    example: 'Star Wars',
    minLength: TITLE_MIN_LENGTH,
  })
  @MinLength(TITLE_MIN_LENGTH)
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'Release date of the movie',
    example: '2020-01-01',
  })
  @IsDateString()
  releaseDate: string;

  @ApiProperty({
    type: 'string',
    description: 'Synopsis of the movie',
    example: 'Star Wars is an American comic book and published by Marvel Comics.',
    maxLength: SYNOPOSIS_MAX_LENGTH,
    required: false,
  })
  @IsOptional()
  @MaxLength(SYNOPOSIS_MAX_LENGTH)
  synopsis?: string;
}
