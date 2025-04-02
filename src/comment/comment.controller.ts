import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt_auth.guard';


@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Request() req,@Body() createCommentDto: CreateCommentDto) {

    return this.commentService.create(createCommentDto,req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.find(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}