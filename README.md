UTN Ingeniería y Calidad de Software 2025
Proyecto 2: Gestión Ventas

Backend: 2025_proyecto2_back_gdv

Objetivo General
En este proyecto, los alumnos deberán desarrollar una aplicación web destinada a gestionar las ventas de productos. El propósito del trabajo consiste en aplicar conceptos de Ingeniería de Software, tales como planificación de proyectos, pruebas, métricas y estimación de esfuerzos.

Descripción del Proyecto Inicial

Artefactos a entregar:

- Repositorios del proyecto.
- URL actualizada de la aplicación desplegada.
- Documentos generados.

---

# 2025_proyecto2_back_gdv — Backend (NestJS + Prisma)

## Descripción

API REST construida con NestJS (TypeScript) para la gestión de ventas: usuarios, productos, marcas, categorías, proveedores, facturación y logs. Usa Prisma como ORM con PostgreSQL y nodemailer para envíos de correo.

Contenido del README

- Requisitos e instalación
- Variables de entorno mínimas
- Comandos (dev / build / prod / tests)
- Prisma: migraciones y studio
- Endpoints, DTOs, enums, guards, pipes y patrones usados
- Despliegue (Azure) y recomendaciones de seguridad

## Requisitos

- Node.js >= 18 (se recomienda 20)
- npm
- PostgreSQL
- (Opcional) Docker para levantar base de datos localmente

## Instalación y ejecución local

1. Clonar el repositorio y entrar en la carpeta:

```bash
git clone <repo-url>
cd 2025_proyecto2_back_gdv
```

2. Instalar dependencias:

```bash
npm ci
```

3. Crear archivo `.env` en la raíz con las variables mínimas (ejemplo abajo).

4. Generar el cliente de Prisma y aplicar migraciones de desarrollo:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Ejecutar la aplicación en modo desarrollo:

```bash
npm run start:dev
```

6. Compilar y ejecutar en producción (local):

```bash
npm run build
npm run start:prod
```

## Variables de entorno (mínimas)

Crear `.env` con al menos estas variables. Ajusta valores para producción.

```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gdv
PORT=3000
# JWT
JWT_AUTH_SECRET=replace_this_secret
JWT_REFRESH_SECRET=replace_refresh_secret
JWT_RESET_SECRET=replace_reset_secret
# Mail (ejemplo usado en código: Mailtrap sandbox)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_pass
```

Nota de seguridad: actualmente `src/common/config/jwtConfig.ts` y `src/common/mail.service.ts` contienen valores por defecto/ejemplo. Recomiendo cambiarlos para leer `process.env` y no dejar secretos en el repo.

## Comandos principales

- npm run start:dev — desarrollo (watch)
- npm run start — producción con Nest
- npm run build — compila a `dist/`
- npm run start:prod — ejecuta `node dist/main`
- npm run test — tests unitarios
- npm run test:e2e — tests e2e

## Prisma (útil)

- Generar cliente: `npx prisma generate`
- Crear migración local: `npx prisma migrate dev --name <name>`
- Aplicar migraciones en producción: `npx prisma migrate deploy`
- Abrir Prisma Studio: `npx prisma studio`

## Estructura importante del proyecto

- `src/` — código TypeScript
- `src/auth` — autenticación (controllers, service, guards, dto)
- `src/usuario` — gestión de usuarios
- `src/producto`, `src/marca`, `src/categoria`, `src/proveedor`, `src/factura`, `src/logs` — módulos por dominio
- `prisma/` — schema y migraciones
- `.github/workflows/` — CI/CD (deploy a Azure)

## API: Endpoints principales (resumen)

Base URL: http://localhost:${process.env.PORT || 3000} (dependiendo de `PORT`)

Auth (src/auth/auth.controller.ts)

- POST /auth/register — Registrar usuario
  - DTO: `RegisterAuthDto` (email, firstName, lastName, password, role?)
- POST /auth/login — Login (retorna tokens)
  - DTO: `LoginAuthDto` (email, password)
- POST /auth/logout
- POST /auth/refresh — Refrescar token (body: { refreshToken })
- POST /auth/forgot-password — Solicitar reset (body: { email })

Usuarios (src/usuario/usuario.controller.ts) — protegido por JWT y Roles

- GET /usuarios/profile — perfil del usuario autenticado
- POST /usuarios — crear usuario (Role.AUDITOR requerido)
- GET /usuarios — listar (Role.AUDITOR)
- GET /usuarios/email/:email — buscar por email (Role.AUDITOR)
- GET /usuarios/:id — obtener por id
- PATCH /usuarios/:id — actualizar
- DELETE /usuarios/:id — eliminar (Role.AUDITOR)

Proveedores (src/proveedor/proveedor.controller.ts)

- GET /proveedores
- GET /proveedores/:id

Marcas (src/marca/marca.controller.ts)

- POST /marcas — crear
- GET /marcas — listar
- GET /marcas/:id — obtener por id
- GET /marcas/:name — obtener por nombre
- PATCH /marcas/:id — actualizar
- DELETE /marcas/:id — eliminar

Categorías (src/categoria/categoria.controller.ts)

- GET /categorias
- GET /categorias/:id
- POST /categorias — crear
- PUT /categorias/:id — actualizar
- DELETE /categorias/:id — eliminar

Productos (src/producto/producto.controller.ts)

- POST /productos — crear (Role.AUDITOR)
- GET /productos — listar
- GET /productos/:id — obtener
- PATCH /productos/:id — actualizar (Role.AUDITOR)
- DELETE /productos/:id — eliminar (Role.AUDITOR)

Facturas (src/factura/factura.controller.ts)

- POST /facturas — crear (body: `CreateFacturaDto`)
- DELETE /facturas/:id — eliminar (Role.AUDITOR)
- GET /facturas — listar
- GET /facturas/:id — obtener

Logs (src/logs/logs.controller.ts)

- GET /logs — listar (Role.AUDITOR)

## DTOs destacados (resumen)

- RegisterAuthDto (src/auth/dto/register.dto.ts)
  - email: string (validador IsEmail)
  - firstName: string
  - lastName: string
  - password: string (MinLength(6), patrones: al menos una mayúscula, una minúscula y un número)
  - role?: Role

- LoginAuthDto (src/auth/dto/login.dto.ts)
  - email: string
  - password: string (MinLength(6))

- CreateProductoDto (src/producto/dto/create-producto.dto.ts)
  - name: string
  - stock?: number
  - price: number (IsPositive)
  - imagesURL: string[] (IsUrl each)
  - brandId?: number
  - providerId?: number
  - categoryIds?: number[] (IsInt each, ArrayNotEmpty)

- CreateMarcaDto / UpdateMarcaDto
  - name: string
  - logo?: string
  - description?: string
  - isActive?: boolean

- CreateCategoriaDto / UpdateCategoriaDto
  - name: string
  - description?: string

- CreateFacturaDto (src/factura/dto/create-factura.dto.ts)
  - invoiceNumber: number
  - userId: number
  - items: CreateFacturaItemDto[] (productId, quantity, providerId, unitPrice)

- CreateLogDto (src/logs/dto/create-log.dto.ts)
  - status: LogStatus
  - action: string
  - userId?: number
  - details?: string

## Enums

- Role (src/common/enums/roles.enums.ts): `USER`, `AUDITOR`
- LogStatus (prisma/schema.prisma): `INFO`, `SUCCESS`, `FAILURE`

## Guards / Decorators / Pipes

- `JwtAuthGuard` (src/auth/auth-roles.guard.ts)
  - Extrae y valida el token Bearer del header `Authorization` y añade `request.user`.

- `RolesGuard` + `@Roles()` (src/auth/roles.guard.ts, src/auth/roles.decorators.ts)
  - Comprueba metadata de roles y valida `request.user.role`.

- `ParseIntPipe` (src/common/pipes/parse-int.pipe.ts)
  - Convierte parámetros a entero y valida > 0.

## Patrones de diseño y buenas prácticas aplicadas

- Modularidad de NestJS: cada dominio en su módulo.
- DTOs + `class-validator` para validación declarativa de la entrada.
- Guards para separar autenticación y autorización.
- Auditoría: `LogsService` es invocado después de operaciones críticas para generar registros.
- Prisma para el acceso a datos y migraciones.

## Convenciones de errores y respuestas

- 400 Bad Request — errores de validación (class-validator)
- 401 Unauthorized — sin token o token inválido
- 403 Forbidden — rol no autorizado
- 404 Not Found — recurso no encontrado (según implementación del servicio)

## Despliegue (resumen y recomendaciones)

El repo tiene un workflow en `.github/workflows/main_2025-proyecto2-back-gdv.yml` para desplegar a Azure. Opciones:

- Publish profile (más sencillo): descargar el publish profile desde Azure Portal y guardarlo como secret `AZURE_WEBAPP_PUBLISH_PROFILE`.
- Service Principal (recomendado para entornos más controlados): generar JSON con `az ad sp create-for-rbac --sdk-auth` y guardarlo como `AZURE_CREDENTIALS`.

Notas prácticas:

- Asegurar que `node_modules` de producción estén presentes o que el App Service ejecute `npm ci`/`npm run build` durante el despliegue (SCM_DO_BUILD_DURING_DEPLOYMENT=true).
- Verificar versión de Node en Azure (recomiendo Node 20 para compatibilidad con dependencias del proyecto).
