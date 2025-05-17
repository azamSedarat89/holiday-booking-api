import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthType } from '../interfaces/user-auth.nterface';

export const UserAuth = createParamDecorator(
  (data: keyof UserAuthType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authData = {
      email: request?.auth.email,
      sub: request?.auth?.sub,
      role: request?.auth?.role,
    };
    if (data) {
      return authData?.[data];
    }
    return authData;
  },
);
