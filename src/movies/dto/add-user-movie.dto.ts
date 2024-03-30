import { IsUUID } from 'class-validator';

/**
 * @description Add user's favourite movie input parameters
 */
export class AddUserMovieDto {
  @IsUUID('4')
  userId: string;

  @IsUUID('4')
  movieId: string;
}
