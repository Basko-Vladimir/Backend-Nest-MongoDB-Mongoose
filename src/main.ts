import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionsFilter } from './filters/http-exceptions.filter';
import { exceptionFactory } from './factories/exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  app.useGlobalFilters(
    // new ServerErrorsExceptionsFilter(),
    new HttpExceptionsFilter(),
  );
  await app.listen(process.env.PORT);
}

bootstrap();
