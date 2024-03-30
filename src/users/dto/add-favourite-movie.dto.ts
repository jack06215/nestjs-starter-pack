import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * @description Request body for adding a favourite movie
 */
export class AddFavouriteMovieParam {
  @IsUUID('4')
  @ApiProperty({
    name: 'movieId',
    description: 'Movie ID',
    example: 'd33c0d3a-5da4-431b-b277-729dd800d799',
  })
  movieId: string;
}

export type AddFavouriteMovieDto = {
  movieId: string;
};
