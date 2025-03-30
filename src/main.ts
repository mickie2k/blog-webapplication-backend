import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;

  // console.log(process.env.NODE_ENV);
  // if (process.env.NODE_ENV === 'production') {
  //   console.log('Production mode');
  //   httpsOptions = {
  //     key: fs.readFileSync('./cert/cert.key'),
  //     cert: fs.readFileSync('./cert/cert.crt'),
  //   };
  // }
  const app = await NestFactory.create(AppModule,{
    logger: ['debug','error', 'warn', 'log'],
    httpsOptions,
  });

  console.log(process.env.FRONTEND_URL);
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
