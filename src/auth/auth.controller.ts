import { Body, ConflictException, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResourceNotFound } from '@local/shared/api';
import { CreateAccountRequest } from '@local/users/dto/register-user.dto';
import { UsersService } from '@local/users/users.service';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInRequest } from './dto/sign-in.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth Service')
@Controller('auth')
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username already exists',
  })
  @Post('sign-up')
  async signUp(@Body() createAccountRequest: CreateAccountRequest) {
    const res = await this.usersService.createUserAccountUsecase({
      username: createAccountRequest.username,
      password: createAccountRequest.password,
    });
    if (res.isSuccess()) {
      return res.value;
    }
    if (res.isFailure()) {
      if (res.error instanceof ResourceNotFound) {
        throw new ConflictException('Username already exists');
      }
    }
  }

  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully signed in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @Post('sign-in')
  async signIn(@Body() signInRequest: SignInRequest) {
    return this.authService.signInUsecase({
      username: signInRequest.username,
      password: signInRequest.password,
    });
  }
}
