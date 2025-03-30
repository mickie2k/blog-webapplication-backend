import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash'
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';
@Injectable()
export class BlogService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }
  async create(createBlogDto: CreateBlogDto, user: any) {
    // Transform createBlogDto to an instance of CreateBlogDto
    const transformedCreateBlogDto =  plainToClass(CreateBlogDto, createBlogDto);

    // Log to verify if transformation is working
    console.log(transformedCreateBlogDto);

    const { title, content } = transformedCreateBlogDto;  // Use the transformed DTO
 

    console.log(user)
    // Prepare the blog object

    const blog = {
      title,
      content,
      authorid: user.id,
    };

    // Insert the blog into the database
    const result = await this.db.insert(schema.blog).values(blog);
    return result;
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
