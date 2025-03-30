import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards , Request, ClassSerializerInterceptor, UseInterceptors, UnauthorizedException} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';



@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto, req.user);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

   
  @UseGuards(JWTAuthGuard)
  @Get('me')
  findMyblog(@Request() req) {
   return this.blogService.findMyBlog(req.user);
   
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const res = await this.blogService.update(+id, updateBlogDto,  req.user);
    if(res){ 
      return  {message: "Blog updated successfully"};
    }else{
      throw new UnauthorizedException("You are not authorized to update this blog");
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @Roles(Role.PREMIUM)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id/content')
  getContent(@Param('id') id: string) {
   return this.blogService.getPremiumContent(+id);
   
  }



}
