import { Inject, Injectable } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';
import { from } from 'form-data';

import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash'
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';
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
w
  async findAll() {
    const result = await this.db.select().from(schema.blog);

    const resultSubsstring = result.map((item)=>{
      return {
        ... item,
        content: item.content?  _.truncate(item.content, { length: 100 }) : "", 
      }
    })


    return resultSubsstring
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
  async findOne(id: number) {
    const result = await this.db.query.blog.findFirst({
      where: eq(schema.blog.id, id),
    });
    if(result?.isPremium && result?.content) {
      result.content = _.truncate(result.content, { length: 300 });
    }
    return result;
  }

  async getPremiumContent(id: number) {
    const result = await this.db.query.blog.findFirst({
      columns: {content: true},
      where: eq(schema.blog.id, id),
    });
    return result;
  }

  async findMyBlog(user: any) {

    const result = await this.db.query.blog.findMany({
      where: eq(schema.blog.authorid, user.id),
    });
    return result;

  }

  async update(id: number, updateBlogDto: UpdateBlogDto , user:any) {
    const result = await this.db.update(schema.blog).set(updateBlogDto).where(
      and(
      eq(schema.blog.id, id),
      eq(schema.blog.authorid, user.id)
    )
    );
    if(result[0].affectedRows > 0){
      return  true;
    }
    else{
      return false;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
