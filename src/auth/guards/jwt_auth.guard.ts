
import {
    Injectable,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

  @Injectable()
  export class JWTAuthGuard extends AuthGuard('jwt'){}

  
  //   async canActivate(context: ExecutionContext): Promise<boolean> {
  //     const request = context.switchToHttp().getRequest();
  //     const token = this.extractTokenFromCookie(request);
  //     if (!token) {
  //       throw new UnauthorizedException();
  //     }
  //     try {
  //       const payload = await this.jwtService.verifyAsync(
  //         token,
  //         {
  //           secret: process.env.JWT_TOKEN
  //         }
  //       );
  //       // 💡 We're assigning the payload to the request object here
  //       // so that we can access it in our route handlers
  //       request['user'] = payload;
  //     } catch {
  //       throw new UnauthorizedException();
  //     }
  //     return true;
  //   }
  
  //   private extractTokenFromHeader(request: Request): string | undefined {
  //     const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //     return type === 'Bearer' ? token : undefined;
  //   }

  //   private extractTokenFromCookie(request: Request): string | undefined {
  //       const  token = request?.cookies?.access_token;
  //       return token;
  //     }
  // }
  