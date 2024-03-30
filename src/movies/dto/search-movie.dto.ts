import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class SearchMoviesQueryParam {
  @ApiProperty({
    name: 'search',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Length(1, 1000)
  search?: string;
}
