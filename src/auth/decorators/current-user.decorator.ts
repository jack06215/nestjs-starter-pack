import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * @description Extract authenticated user information
 */
export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;

  if (!user) {
    return null;
  }
  return data ? user[data] : user;
});
