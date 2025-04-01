import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ?  `.env.${process.env.NODE_ENV}` : '.env',
      isGlobal: true, // Makes the config accessible throughout the app
    }), UserModule, DrizzleModule, AuthModule, BlogModule, AdminModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
