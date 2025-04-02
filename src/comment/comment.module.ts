import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService], // Exporting CommentService to be used in other modules
})
export class CommentModule {}
