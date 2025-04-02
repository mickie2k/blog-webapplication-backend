import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [DrizzleModule, CommentModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
