import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginUserDto, RegisterUserDto } from 'src/auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import * as schema from 'src/drizzle/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';
import { Response } from 'express';


@Injectable()
export class AuthService {
    private secret: Buffer;
    constructor(private readonly userService: UserService,  private jwtService: JwtService, @Inject(DRIZZLE) private db: DrizzleDB) {
        this.secret = this.getSecret();
        
    }

    private getSecret(): Buffer {
        const secret = process.env.AUTH_SECRET;
        if (!secret) {
          throw new InternalServerErrorException('AUTH_SECRET is not defined in environment variables.');
        }
    
        // Return secret as a Buffer (base64 encoded)
        return Buffer.from(secret, 'base64');
      }
    


    async validateUser(data: LoginUserDto) {
        const {email, password} = data;

  
      

        if(!email || !password){
            throw new BadRequestException('Email and password are required');
        }

        if(email.length === 0 || password.length < 6){
            throw new BadRequestException('Password must be at least 6 characters long');
        }
        
        
        const user = await this.userService.findUserWithoutSSO({email: email});

        if(!user){
            throw new UnauthorizedException('Email or Password is incorrect');
        }
        
        if(user.password && await argon2.verify(user.password, password,{ secret: this.secret})){
            const {password, ...result} = user;
          return result;

        } else {
          throw new UnauthorizedException('Email or Password is incorrect');
        }
    }

    async login(user: any, res: Response, redirect:boolean = false) {

           const payload = { sub: user.id, email: user.email, roleid: user.roleid};
           
        
          const accessToken = await this.jwtService.signAsync(payload)
          const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            // need different secret 
          })
          
             res.cookie('access_token', accessToken , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000 * 60 * 60)
            })

            res.cookie('refresh_token', refreshToken , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            })
          
            if(redirect){
              res.redirect(process.env.FRONTEND_URL + '');
            }else{
                return {
                  message: 'Login Successful'
              };
        
            }

        
    }

    async register(data: RegisterUserDto){
      
          if(!data.email || !data.password){
            throw new UnauthorizedException('Required Email and Password');
        }

        if(data.email.length === 0 || data.password.length < 6){
            throw new UnauthorizedException('Required Email and Password More than 6 characters');
        }
    
        if(await this.userService.findUser({email: data.email})){
            throw new UnauthorizedException('Email already exists');
        }
        const hash = await argon2.hash(data.password,{
            secret: this.secret
            
        });
        const roleid = 2;
        const user = await this.userService.createUser({...data, password: hash, roleid});
        return user;
    }

    async googleLogin(req) : Promise<any>{
      if (!req.user) {
        throw new Error('Google login failed: No user information received.');
      }

      const { email, firstName, lastName, googleId } = req.user;
      const user = await this.db.query.users.findFirst({
        where: eq(schema.users.email, email) ,
      })
      let payload = {};
      if (!user) {
        const result = await this.db.insert(schema.users).values({
          email,
          username: firstName,
          firstName,
          lastName,
          googleId,
          roleid: 2,
        }).$returningId()
        if(!result){
          throw new UnauthorizedException('Google login failed: Unable to create user');
        };
        payload = { id: result, email: email, roleid: 2};
      }else{
        payload = { id: user.id, email: user.email, roleid: user.roleid};
      }
       
      return this.login(payload, req.res, true);
        
    }

    async refreshToken(user: any, res: Response) {
    }
  }


