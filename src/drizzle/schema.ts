

import { int, mysqlTable, varchar, boolean, date, text } from "drizzle-orm/mysql-core";
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

export const roles = mysqlTable('roles', {
    roleid: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }),
})

export const blog = mysqlTable('blog', {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }),
    content: text(),
    authorid: varchar({ length : 36}).references(()=> users.id),
    isPremium: boolean(),
    createdAt: date(),
    updatedAt: date(),
})
