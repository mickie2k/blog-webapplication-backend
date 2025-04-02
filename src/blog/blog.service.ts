import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash'
import { eq, lt, gte, ne,and, isNull, isNotNull,desc } from 'drizzle-orm';
import { Role } from 'src/auth/enums/role.enum';
@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }
  async create(createBlogDto: CreateBlogDto, user: any) {

    const transformedCreateBlogDto =  plainToClass(CreateBlogDto, createBlogDto);

    const { title, content, isPremium } = transformedCreateBlogDto;  // Use the transformed DTO
 
    const blog = {
      title,
      content,
      authorid: user.id,
      isPremium
    };

    if(isPremium && user.role === Role.USER){
      throw new ForbiddenException("You are not authorized to create a premium blog");
    }

    const result = await this.db.insert(schema.blog).values(blog).$returningId();
    return result[0];
  }
w
  async findAll() {
    const result = await this.db.select({
      id: schema.blog.id,
      title: schema.blog.title,
      content: schema.blog.content,
      isPremium: schema.blog.isPremium,
      authorName: schema.users.username,
      createdAt: schema.blog.createdAt,
      updatedAt: schema.blog.updatedAt,
    }
    ).from(schema.blog).leftJoin(schema.users, eq(schema.blog.authorid, schema.users.id)).orderBy(desc( schema.blog.id));

    const resultSubsstring = result.map((item)=>{
      return {
        ... item,
        content: item.content?  _.truncate(item.content, { length: 100 }) : "", 
      }
    })


    return resultSubsstring
  }

  async findOne(id: number) {
    const result = await this.db.select({
      id: schema.blog.id,
      title: schema.blog.title,
      content: schema.blog.content,
      isPremium: schema.blog.isPremium,
      authorName: schema.users.username,
      createdAt: schema.blog.createdAt,
      updatedAt: schema.blog.updatedAt,
    }
    ).from(schema.blog).where(eq(schema.blog.id, id)).leftJoin(schema.users, eq(schema.blog.authorid, schema.users.id)).limit(1);

    const data = result[0];

    if(!data){
      throw new NotFoundException("Blog not found");
    }

    if(data?.isPremium && data?.content) {
      data.content = _.truncate(data.content, { length: 1000 });
    }
    return data;
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
      orderBy: desc(schema.blog.id),
    });
    return result;

  }

  async getMyBlogId(id: number, user: any) {
    const result = await this.db.query.blog.findFirst({
      where: and(
        eq(schema.blog.id, id),
        eq(schema.blog.authorid, user.id)),
    });
    
    if(result){
      return result;
    }else{
      throw new ForbiddenException("You are not authorized to access this blog");
    }
    
  
  }


  async update(id: number, updateBlogDto: UpdateBlogDto , user:any) {

    if(updateBlogDto.isPremium && user.role === Role.USER){
      throw new ForbiddenException("You are not authorized to publish a premium blog");
    }

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

  async remove(id: number, user:any) {
      const result = await this.db.delete(schema.blog).where(
        and(
          eq(schema.blog.id, id),
          eq(schema.blog.authorid, user.id)
        )
      );
      
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Blog with id ${id} not found or you don't have permission to delete it`);
      }
      
      return { success: true, message: 'Blog deleted successfully' };
    
  }
}
