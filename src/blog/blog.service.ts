import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';

@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async createBlog(data: CreateBlogDto) {
    try{
      const blog = await this.db.insert(schema.blogs).values(data);
      return blog;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to create blog');
    }
  }

  async update(id: number, data: UpdateBlogDto) {
    try{
      const updateBlog = await this.db.update(schema.blogs).set({}).where();
      return updateBlog;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to create blog');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

}
