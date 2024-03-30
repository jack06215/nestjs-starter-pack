import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';

import { CurrentUserInterceptor } from '@local/auth/interceptor/current-user.interceptor';
import { UsersService } from '@local/users/users.service';

@Injectable()
// "implements" guide us how to put together an interceptor
export class MockCurrentUserInterceptor extends CurrentUserInterceptor {
  private mockUserService: UsersService;

  constructor(userService: UsersService) {
    super(userService);
    this.mockUserService = userService;
  }
  // handler refers to the route handler
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.mockUserService.findId(userId);
      // we need to pass this down to the decorator. SO we assign the user to request because req can be retrieved inside the decorator
      request.currentUser = user;
    }
    // run the actual route handler
    return handler.handle();
  }
}
