
import {
    CanActivate,
    ExecutionContext,
    Injectable,

    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

  @Injectable()
  export class JWTAuthGuard extends AuthGuard('jwt'){}
  
  // @Injectable()
  // export class JWTAuthGuard implements CanActivate {
  //   constructor(private jwtService: JwtService) {}
  
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
  