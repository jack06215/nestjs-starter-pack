import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
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
import { ResourceNotFound } from '@local/shared/api';
import { SimpleResponse } from '@local/shared/response';
import { UsersService } from '@local/users/users.service';

import { AddMovieReviewBody, AddMovieReviewDto, AddMovieReviewParam } from './dto/add-movie-review.dto';

@ApiTags('Movie Service')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadGatewayResponse({ description: 'Bad Gateway' })
@Controller('movies')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class MovieReviewsController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Add a movie review' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or Movie not found' })
  @Post(':movieId/review')
  async addMovieReview(
    @CurrentUser() user: UserEntity,
    @Param() param: AddMovieReviewParam,
    @Body() body: AddMovieReviewBody,
  ): Promise<SimpleResponse> {
    const addMovieReviewDto: AddMovieReviewDto = {
      userId: user.id,
      movieId: param.movieId,
      rating: body.rating,
      comment: body.comment,
    };
    const res = await this.usersService.upsertMovieReviewUsecase(addMovieReviewDto);
    if (res.isSuccess()) {
      return {
        message: 'ok',
      };
    }
    if (res.isFailure()) {
      if (res.error instanceof ResourceNotFound) {
        throw new NotFoundException(res.error.message);
      }
    }
  }
}
