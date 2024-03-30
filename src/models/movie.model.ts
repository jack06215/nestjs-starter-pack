import { MovieEntity } from '@local/entities/movies.entity';

/**
 * @description Movie data model
 */
export class MovieModel {
  id: string;
  title: string;
  synopsis: string;
  rating: number;
  releaseDate: Date;
}

export function convertMovieToModel(movie: MovieEntity): MovieModel {
  return {
    id: movie.id,
    title: movie.title,
    synopsis: movie.synopsis,
    rating: movie.rating,
    releaseDate: movie.releaseDate,
  };
}
