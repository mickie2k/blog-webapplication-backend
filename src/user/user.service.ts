import { Inject, Injectable } from '@nestjs/common';

import * as schema from 'src/drizzle/schema';
import { CreateUserDto, FindUserDto  } from './dto/user.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzletype';
import { eq, lt, gte, ne,and, isNull, isNotNull } from 'drizzle-orm';

@Injectable()
export class UserService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }


    async createUser(data: CreateUserDto) {
        try{
            const user = await this.db.insert(schema.users).values(data);
            return user;
        }catch (error) {
            console.log(error)
            throw new Error('Failed to create user');
        }
    }

    async findUser(data: FindUserDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, data.email)
        })
        return user;
    }

    async findUserWithoutSSO(data: FindUserDto) {
        const user = await this.db.query.users.findFirst({
            where: and(
            eq(schema.users.email, data.email),
            isNull(schema.users.googleId),
            isNotNull(schema.users.password)
            )
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

