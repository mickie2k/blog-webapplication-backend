import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;
  const corsUri = process.env.FRONTEND_URL?.split(' ');
  const app = await NestFactory.create(AppModule,{
    logger: ['debug','error', 'warn', 'log'],
    httpsOptions,
  });

  console.log(corsUri);
  app.enableCors({
    origin: corsUri,
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
