import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength } from 'class-validator';

import { PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH } from '@local/shared/const';

/**
 * @description Sign in request body
 */
export class SignInRequest {
  @ApiProperty({
    type: 'string',
    description: 'The username',
    example: '',
  })
  @IsAlphanumeric()
  @MaxLength(USERNAME_MAX_LENGTH)
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'The password',
    example: '',
  })
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string;
}

/**
 * @description Sign in input parameters
 */
export class SignInDto {
  username: string;
  password: string;
}
