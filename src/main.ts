import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './app/exceptions/mongo.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoExceptionFilter(app.getHttpAdapter()));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}

bootstrap();
