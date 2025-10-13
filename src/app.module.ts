import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';

@Module({
  imports: [MarcaModule, CategoriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
