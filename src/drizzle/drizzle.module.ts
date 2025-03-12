import { Module } from '@nestjs/common';

import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as mysql from 'mysql2/promise';
import * as schema from './schema';
export const DRIZZLE = Symbol('drizzle-connection');


@Module({
  providers: [
    {
          provide:DRIZZLE,
          useFactory: async() =>{
              const host = process.env.DATABASE_HOST;
              const user = process.env.DATABASE_USER;
              const database = process.env.DATABASE_NAME;
              const password = process.env.DATABASE_PASSWORD;
              
              const poolConnection = mysql.createPool({
                  host: host,
                  user: user,
                  password: password,
                  database: database,
                  connectionLimit: 10
                }); 
              const db = drizzle(poolConnection, { schema, mode: 'default' }) as MySql2Database<typeof schema>;
              try {
                  await poolConnection.getConnection();
                  console.log('Database connected successfully');
                } catch (error) {
                  console.error('Error connecting to database', error);
                }
                
              return db;
              
          }
    }
   ],
   exports: [DRIZZLE]

})

export class DrizzleModule {}
