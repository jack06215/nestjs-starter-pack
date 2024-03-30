import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetMovieDetailParam {
  @ApiProperty({
    name: 'movieId',
    description: 'Movie ID',
    example: '0b3772ca-c248-40c7-b7a4-91b0e60758e3',
  })
  @IsUUID('4')
  movieId: string;
}
