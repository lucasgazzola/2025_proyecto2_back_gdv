import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaCategoriaRepository } from './repositories/prisma-categoria.repository';
import { ICategoriaRepositoryToken } from './repositories/categoria.repository.interface';

@Module({
  controllers: [CategoriaController],
  providers: [
    CategoriaService,
    PrismaCategoriaRepository,
    {
      provide: ICategoriaRepositoryToken,
      useClass: PrismaCategoriaRepository,
    },
  ],
  exports: [CategoriaService],
})
export class CategoriaModule {}
