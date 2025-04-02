import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CommentService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

  async create(createCommentDto: CreateCommentDto,user : any) {
    try{
        const { blogid, content } = createCommentDto;  // Use the transformed DTO
        const comment = {
          blogid,
          content,
          userid: user.id,
        };
        const result = await this.db.insert(schema.comment).values(comment);
        if(result[0].affectedRows > 0){
          return {
            id: result[0].insertId,
            content: content,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
        throw new Error('Failed to create comment');
    }catch (error) {
        throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async find(id: number) {
    const result = await this.db.query.comment.findFirst({
      where: eq(schema.comment.id, id),
    });
    return result;
  }

  async findByBlogId(id: number) {
    const result = await this.db.select({
      id: schema.comment.id,
      content: schema.comment.content,
      createdAt: schema.comment.createdAt,
      updatedAt: schema.comment.updatedAt,
      authorName: schema.users.username,
    }).from(schema.comment).where(eq(schema.comment.blogid, id)).leftJoin(schema.users, eq(schema.comment.userid, schema.users.id));
    return result;
  }

  async remove(id: number) {
    try{
      const deleteComment = await this.db.delete(schema.comment).where(eq(schema.comment.id, id));
      return deleteComment;
    }catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}