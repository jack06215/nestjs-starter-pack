import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from 'config/config.module';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { dbConfig } from './mikro-orm.config';
import { MovieReviewsModule } from './movie-reviews/movie-reviews.module';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigurationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRoot(dbConfig),
    AuthModule,
    UsersModule,
    MoviesModule,
    MovieReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
