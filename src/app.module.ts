import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env',
      isGlobal: true, // Makes the config accessible throughout the app
    }), UserModule, DrizzleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
