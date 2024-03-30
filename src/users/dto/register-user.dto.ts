import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@local/shared/const';

/**
 * @description Sign up request body
 */
export class CreateAccountRequest {
  @ApiProperty({
    type: 'string',
    description: 'The username',
    example: '',
  })
  @IsAlphanumeric()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'The password',
    example: '',
  })
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password: string;
}

export type RegisterUserDto = {
  username: string;
  password: string;
};
