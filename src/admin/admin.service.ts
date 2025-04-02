
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AdminService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

  async getAllInfo() {
    const allUser = await this.db.$count(schema.users);
    const allBlog = await this.db.$count(schema.blog);
    const premiumBlog = await this.db.$count(schema.blog, eq(schema.blog.isPremium, true));
    const premiumUser = await this.db.$count(schema.users, eq(schema.users.roleid, 3));
    return {
      allBlog: allBlog,
      premiumBlog: premiumBlog,
      allUser: allUser,
      premiumUser: premiumUser,
    };
  }

  async findAllUser() {
    const allUser = await this.db.select().from(schema.users);
    const safeUsers = allUser.map(({ password, ...user }) => user);
    return safeUsers;
  }

  async findAllBlog() {
    const allBlog = await this.db.select({
      id: schema.blog.id,
      title: schema.blog.title,
      content: schema.blog.content,
      createdAt: schema.blog.createdAt,
      updatedAt: schema.blog.updatedAt,
      isPremium: schema.blog.isPremium,
      username: schema.users.username,
    }).from(schema.blog).innerJoin(schema.users, eq(schema.users.id, schema.blog.authorid));

    return allBlog;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}