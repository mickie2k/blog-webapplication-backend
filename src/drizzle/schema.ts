
import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export const users = mysqlTable('users', {
    id: varchar({ length : 36}).primaryKey().$defaultFn(()=> uuid()),
    username: varchar({ length: 255 }),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    email: varchar({ length: 255 }).unique(),
    password: varchar({ length: 255 }),
    roleid: int().references(()=> roles.roleid),
    googleId: varchar({ length: 255 }),

})

export const blogs = mysqlTable('blogs', {
    id: varchar({ length : 36}).primaryKey().$defaultFn(()=> uuid()),
    username: varchar({ length: 255 }),
    content: varchar({ length: 255 }),
    createTime: timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),

})

export const roles = mysqlTable('roles', {
    roleid: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }),
})
