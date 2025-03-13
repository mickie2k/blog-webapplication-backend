import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt_auth.guard';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    createUser(@Body() data: CreateUserDto){
        return this.userService.createUser(data);

    }
    
    @UseGuards(JWTAuthGuard)
    @Get('username')
    getUser(@Request() req){
        return this.userService.getUsername(req.user);
    }





}
