import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';

import { Public } from '@local/auth/decorators/public.decorator';
import { MovieModel } from '@local/models/movie.model';
import { JSONResponse } from '@local/shared/response';

import { AddMovieRequestBody } from './dto/add-movie.dto';
import { GetMovieDetailParam } from './dto/get-movie-detail.dto';
import { SearchMoviesQueryParam } from './dto/search-movie.dto';
import { MoviesService } from './movies.service';

@ApiTags('Movie Service')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @ApiOperation({ summary: 'Add a movie' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created successfully',
  })
  @Post()
  async addMovie(@Body() body: AddMovieRequestBody) {
    return this.moviesService.addMovieUsecase({
      title: body.title,
      releaseDate: body.releaseDate,
      synopsis: body.synopsis,
    });
  }

  @Public()
  @ApiOperation({ summary: 'Get popular movies, or search movies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of searched movies',
  })
  @Get()
  async getMovies(@Query() query: SearchMoviesQueryParam): Promise<JSONResponse<MovieModel[]>> {
    if (query.search) {
      const res = await this.moviesService.searchMovieTitleUsecase(query.search);
      return {
        content: res,
      };
    } else {
      const currentMonth = format(new Date(), 'yyyyMM');
      const res = await this.moviesService.findPopularMoviesMonthlyUsacase(currentMonth);
      return {
        content: res,
      };
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get a movie detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detail of the movie',
  })
  @Get(':movieId')
  async getMovieDetail(@Param() param: GetMovieDetailParam): Promise<MovieModel> {
    const res = await this.moviesService.getMovieDetailUsecase(param);
    if (res.isFailure()) {
      throw new NotFoundException(res.error.message);
    }
    return res.value;
  }
}
