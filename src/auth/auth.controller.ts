import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from 'src/auth/guards/local_auth.guard';
import { JWTAuthGuard } from './guards/jwt_auth.guard';
import { GoogleAuthGuard } from './guards/google_auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService:UserService){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Response({passthrough : true}) res ){
        const { accessToken }  =  await this.authService.login(req.user);
        res.cookie('access_token', accessToken , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
           
        })
        return {
            message: 'Login Successful'
         };
    }

    @Post('/register')
    async register(@Body() data: RegisterUserDto){
        return this.authService.register(data);
    }

    

    @UseGuards(JWTAuthGuard)
    @Get()
    getUser(@Request() req){
        return this.userService.getProfile(req.user);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleAuth(@Request() req) {
      // Initiates the Google OAuth process
    }
  
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleAuthRedirect(@Request() req, @Response({passthrough:true}) res) {
        const { accessToken }  = await this.authService.googleLogin(req);
        res.cookie('access_token', accessToken, {
        httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });
         return {
            message: 'Login Successful'
         };
       
    }
  

}
