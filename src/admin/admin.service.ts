import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import * as schema from 'src/drizzle/schema';
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';

@Injectable()
export class AdminService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

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
    const safeUsers = allUser.map(({ password, ...rest }) => rest);
    return safeUsers;
  }

  async findAllBlog() {
    const allBlog = await this.db.select().from(schema.blog).innerJoin(schema.users, eq(schema.users.id, schema.blog.authorid));
    const safeBlogs = allBlog.map(({ blog, users }) => {
      const { authorid, ...restBlog } = blog;
      return {
        ...restBlog,
        author: {
          username: users.username,
        }
      };
    });
    return safeBlogs;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
