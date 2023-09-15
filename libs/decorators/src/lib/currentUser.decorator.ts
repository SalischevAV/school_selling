import { ExecutionContext, createParamDecorator } from '@nestjs/common';
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
        return ctx.switchToHttp().getRequest().user;
      }
      const user = ctx.getArgs()[2]?.req.headers?.user; //TODO check it later
      
      if (user) {
        return user;
      }
})