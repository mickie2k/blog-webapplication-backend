import { Inject, Injectable } from '@nestjs/common';

import * as schema from 'src/drizzle/schema';
import { CreateUserDto, FindUserDto  } from './dto/user.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { eq, lt, gte, ne } from 'drizzle-orm';

@Injectable()
export class UserService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }


    async createUser(data: CreateUserDto) {
        const user = await this.db.insert(schema.users).values(data)
        return user;
    }

    async findUser(data: FindUserDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, data.email)
        })
        return user;
    }

    async getProfile(user : any) {
        console.log(user);
        const users = await this.db.query.users.findFirst({
            where: eq(schema.users.id, user.id)
        });
        return users;
    }

}

