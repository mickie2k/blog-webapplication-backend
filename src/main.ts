import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode');
    httpsOptions = {
      key: fs.readFileSync('E:/localhost-key.pem'),
      cert: fs.readFileSync('E:/localhost.pem'),
    };
  }
  const app = await NestFactory.create(AppModule,{
    httpsOptions
  });

  console.log(process.env.FRONTEND_URL);
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
