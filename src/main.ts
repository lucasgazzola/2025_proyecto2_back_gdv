import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Global validation pipe: aplica la validación de DTOs en todos los endpoints.
  // - whitelist: elimina propiedades no declaradas en los DTOs
  // - forbidNonWhitelisted: rechaza peticiones con propiedades extra (400)
  // - transform: convierte tipos primitivos (útil para params/queries)
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: elimina propiedades no declaradas en los DTOs
      whitelist: true,
      // forbidNonWhitelisted: si true rechaza peticiones con campos extra.
      // Lo dejamos false para que el backend descarte atributos extras en el body
      // sin lanzar un error. Así el request se limpia (whitelist) pero no falla.
      forbidNonWhitelisted: false,
      // transform: convierte tipos (útil para params/queries)
      transform: true,
      // enableImplicitConversion permite que class-transformer convierta
      // strings a numbers/booleans si la propiedad del DTO está tipada.
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
