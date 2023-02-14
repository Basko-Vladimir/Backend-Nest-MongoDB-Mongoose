import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';
import { ServerErrorsFilter } from './common/filters/server-errors.filter';
import { exceptionFactory } from './common/factories/exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  app.useGlobalFilters(new ServerErrorsFilter(), new HttpExceptionsFilter());
  await app.listen(process.env.PORT);
}

bootstrap();
