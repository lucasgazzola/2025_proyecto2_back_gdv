import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { FacturaModule } from './factura/factura.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [MarcaModule, CategoriaModule, ProductoModule, FacturaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
