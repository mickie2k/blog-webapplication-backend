import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards , Request, ClassSerializerInterceptor, UseInterceptors, UnauthorizedException, NotFoundException} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CommentService } from 'src/comment/comment.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService, private readonly commentService: CommentService) {}
  
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

  @UseGuards(JWTAuthGuard)
  @Get('me/:id')
  getMyBlogByID(@Request() req, @Param('id') id: string) {
   return this.blogService.getMyBlogId(+id,req.user);
   
  }



  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogService.findOne(+id);
    const comment = await this.commentService.findByBlogId(+id);
    if (!blog) {
      throw new NotFoundException("Blog not found");
    }
    return { ...blog, comments: comment };
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

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Request() req,@Param('id') id: string) {
    return this.blogService.remove(+id,req.user);
  }

  @Roles(Role.PREMIUM)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get(':id/content')
  getContent(@Param('id') id: string) {
   return this.blogService.getPremiumContent(+id);
   
  }

  @Get(":id/comments")
  getComments(@Param('id') id: string) {
    return this.commentService.findByBlogId(+id);
  }

}
