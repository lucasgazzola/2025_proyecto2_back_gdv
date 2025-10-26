import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { FacturaModule } from './factura/factura.module';
import { UsuarioModule } from './usuario/usuario.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ClienteModule } from './cliente/cliente.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // carpeta a exponer
      serveRoot: '/uploads', // URL base pública
      // exclude can be a path pattern or RegExp. '/api*' or '/api(.*)' may cause path-to-regexp parse errors
      // Use a safe RegExp that matches any route under /api
      // cast a RegExp to any to satisfy the serve-static typing while keeping a safe runtime pattern
      serveStaticOptions: {
        index: false, // no listar índices
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        redirect: false,
      },
    }),
    MarcaModule,
    CategoriaModule,
    ProductoModule,
    FacturaModule,
    UsuarioModule,
    LogsModule,
    AuthModule,
    ProveedorModule,
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
