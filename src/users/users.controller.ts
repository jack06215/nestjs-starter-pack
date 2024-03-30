import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '@local/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@local/auth/guards/jwt-auth.guard';
import { CurrentUserInterceptor } from '@local/auth/interceptor/current-user.interceptor';
import { UserEntity } from '@local/entities/users.entity';
import { MovieModel } from '@local/models/movie.model';
import { MoviesService } from '@local/movies/movies.service';
import { JSONResponse, SimpleResponse } from '@local/shared/response';

import { AddFavouriteMovieParam } from './dto/add-favourite-movie.dto';

@ApiTags('User Service')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get list of favoutie movies' })
  @ApiResponse({
    status: 200,
    description: "List of user's favoutie movies",
    type: MovieModel,
    isArray: true,
  })
  @Get('favourites')
  async getFavouriteMovies(@CurrentUser() user: UserEntity): Promise<JSONResponse<MovieModel[]>> {
    const res = await this.moviesService.findUserFavouriteMovies(user.id);
    return {
      content: res,
    };
  }

  @ApiOperation({ summary: 'Add a favourite movie' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot find movie or user',
  })
  @Post('favourites/:movieId')
  async addFavouriteMovie(
    @Param() param: AddFavouriteMovieParam,
    @CurrentUser() user: UserEntity,
  ): Promise<SimpleResponse> {
    const success = await this.moviesService.addUserMovieUsecase({
      userId: user.id,
      movieId: param.movieId,
    });
    if (!success) {
      throw new NotFoundException('Cannot add favourite movie');
    }
    return {
      message: 'ok',
    };
  }
}
