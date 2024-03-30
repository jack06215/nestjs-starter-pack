import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { UsersRepository } from '@local/users/users.repository';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersRepository: UsersRepository) {}
  // handler refers to the route handler
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersRepository.findById(userId);
      // we need to pass this down to the decorator. SO we assign the user to request because req can be retrieved inside the decorator
      request.currentUser = user;
    }
    // run the actual route handler
    return handler.handle();
  }
}
