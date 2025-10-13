import { Injectable } from '@nestjs/common';
import { Categoria } from './categoria.interface';

@Injectable()
export class CategoriaService {
  private readonly categorias: Categoria[] = [
    { id: 1, nombre: 'Procesadores', descripcion: 'CPUs de Intel, AMD y otros fabricantes' },
    { id: 2, nombre: 'Placas Madre', descripcion: 'Motherboards compatibles con distintos sockets y chipsets' },
    { id: 3, nombre: 'Memorias RAM', descripcion: 'Módulos DDR4, DDR5 y variantes para laptops y desktops' },
    { id: 4, nombre: 'Almacenamiento', descripcion: 'Discos SSD, HDD, NVMe y externos' },
    { id: 5, nombre: 'Placas de Video', descripcion: 'GPUs dedicadas de NVIDIA, AMD y otras' },
    { id: 6, nombre: 'Fuentes', descripcion: 'PSUs con certificación 80 Plus y distintos wattajes' },
    { id: 7, nombre: 'Gabinetes', descripcion: 'Torres ATX, microATX, miniITX y diseños personalizados' },
  ];

  findAll(): Categoria[] {
    return this.categorias;
  }

  findById(id: number): Categoria | null {
    return this.categorias.find(c => c.id === id) ?? null;
  }
}