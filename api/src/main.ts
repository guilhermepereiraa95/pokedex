import { NestFactory } from '@nestjs/core';
import { PokedexApiModule } from './pokedex-api.module';

async function bootstrap() {
  const app = await NestFactory.create(PokedexApiModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });
  await app.listen(3000);
}

bootstrap();
