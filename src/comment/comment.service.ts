import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CommentService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async create(createCommentDto: CreateCommentDto) {
    try{
        const comment = await this.db.insert(schema.comment).values(createCommentDto);
        return comment;
    }catch (error) {
        console.log(error)
        throw new Error('Failed to create user');
    }
  }

  async findByBlogId(id: number) {
    const result = await this.db.query.comment.findMany({
      where: eq(schema.comment.blogid, id),
    });
    return result;
  }

  async remove(id: number) {
    try{
      const deleteComment = await this.db.delete(schema.comment).where(eq(schema.comment.id, id));
      return deleteComment;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to delete blog');
    }
  }
}
