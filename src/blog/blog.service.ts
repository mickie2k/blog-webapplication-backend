import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';
import { from } from 'form-data';

@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  async createBlog(data: CreateBlogDto) {
    try{
      const blog = await this.db.insert(schema.blog).values(data);
      return blog;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to create blog');
    }
  }

  async update(data: UpdateBlogDto) {
    const { id, ...updates } = data;
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    try{
      const updateBlog = await this.db.update(schema.blog).set(fieldsToUpdate).where(eq(schema.blog.id, id));
      return updateBlog;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to create blog');
    }
  }

  async remove(id: string) {
    try{
      const updateBlog = await this.db.delete(schema.blog).where(eq(schema.blog.id, id));
      return updateBlog;
    }catch (error) {
      console.log(error)
      throw new Error('Failed to delete blog');
    }
  }

  findAll() {
    return `This action returns all blog`;
  }

  async findOne(id: string) {
    const blog = await this.db.select({
      id: schema.blog.id,
      title: schema.blog.title,
      content: schema.blog.content,
      authorid: schema.blog.authorid,
      isPremium: schema.blog.isPremium,
      createdAt: schema.blog.createdAt,
      updatedAt: schema.blog.updatedAt,
    }).from(schema.blog).where(eq(schema.blog.id, id))
    return blog[0];
  }
}
