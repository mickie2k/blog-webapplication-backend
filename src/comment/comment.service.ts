import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';

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

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
