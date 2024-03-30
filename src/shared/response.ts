import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Response body with a simple message
 */
export class SimpleResponse {
  @ApiProperty({
    description: 'A simple response message',
  })
  message: string;
}

export class JSONResponse<T> {
  @ApiProperty({
    description: 'The response data',
  })
  content: T;
}
