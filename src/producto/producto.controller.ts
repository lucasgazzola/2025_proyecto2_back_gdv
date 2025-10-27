import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { flattenValidationErrors, saveBase64Image } from 'src/common/helpers';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/products';
          try {
            fs.mkdirSync(uploadPath, { recursive: true });
          } catch (e) {}
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Solo se permiten imágenes'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async create(@Body() body: any, @UploadedFile() image: any, @Request() req) {
    // Normalize incoming body (brand, categories) BEFORE validation
    // brand
    const rawBrand = body?.brand ?? (req as any).body?.brand;
    if (rawBrand) {
      try {
        const parsed =
          typeof rawBrand === 'string' ? JSON.parse(rawBrand) : rawBrand;
        if (parsed && parsed.id) body.brandId = Number(parsed.id);
      } catch (e) {
        // ignore
      }
    }

    // categories/categoryIds
    const rawCatsBody =
      body?.categoryIds ??
      body?.categories ??
      (req as any).body?.categoryIds ??
      (req as any).body?.categories;
    if (rawCatsBody) {
      try {
        let parsedCats: any = rawCatsBody;
        if (typeof rawCatsBody === 'string') {
          try {
            parsedCats = JSON.parse(rawCatsBody);
          } catch (e) {
            parsedCats = rawCatsBody
              .split(',')
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
          }
        }
        if (
          Array.isArray(parsedCats) &&
          parsedCats.length > 0 &&
          typeof parsedCats[0] === 'object'
        ) {
          body.categoryIds = parsedCats
            .map((c: any) => Number(c.id))
            .filter((n: any) => !Number.isNaN(n));
        } else if (Array.isArray(parsedCats)) {
          body.categoryIds = parsedCats
            .map((c: any) => Number(c))
            .filter((n: any) => !Number.isNaN(n));
        }
      } catch (e) {
        // ignore
      }
    }

    // handle uploaded file or base64 image
    if (image) body.imageURL = `uploads/products/${image.filename}`;
    else {
      // accept both imageURL and imageUrl from client
      const incomingImage = body?.imageURL ?? body?.imageUrl;
      if (
        incomingImage &&
        typeof incomingImage === 'string' &&
        incomingImage.startsWith('data:')
      ) {
        body.imageURL = saveBase64Image(incomingImage);
      } else if (
        incomingImage &&
        typeof incomingImage === 'string' &&
        !incomingImage.startsWith('data:')
      ) {
        // if client provided a remote URL (http...) or already a path, normalize to imageURL
        body.imageURL = incomingImage;
      }
    }

    const createProductoDto = plainToInstance(CreateProductoDto, body);
    const errors = validateSync(createProductoDto, {
      skipMissingProperties: false,
    });
    if (errors && errors.length > 0) {
      const messages = flattenValidationErrors(errors);
      try {
        await this.logsService.createFailureLog(
          'CREATE_PRODUCT_FAILED',
          req.user?.id,
          `Errores de validación: ${JSON.stringify(messages)}`,
        );
      } catch (e) {}
      throw new BadRequestException({
        message: messages,
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const result = await this.productoService.create(createProductoDto as any);
    await this.logsService.createSuccessLog(
      'CREATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} creó producto: ${createProductoDto.name}`,
    );
    return result;
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/products';
          try {
            fs.mkdirSync(uploadPath, { recursive: true });
          } catch (e) {}
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Solo se permiten imágenes'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() image: any,
    @Request() req,
  ) {
    // Normalize brand
    const rawBrand = body?.brand ?? (req as any).body?.brand;
    if (rawBrand) {
      try {
        const parsed =
          typeof rawBrand === 'string' ? JSON.parse(rawBrand) : rawBrand;
        if (parsed && parsed.id) body.brandId = Number(parsed.id);
      } catch (e) {
        // ignore
      }
    }

    // Normalize categories
    const rawCatsBodyU =
      body?.categoryIds ??
      body?.categories ??
      (req as any).body?.categoryIds ??
      (req as any).body?.categories;
    if (rawCatsBodyU) {
      try {
        let parsedCats: any = rawCatsBodyU;
        if (typeof rawCatsBodyU === 'string') {
          try {
            parsedCats = JSON.parse(rawCatsBodyU);
          } catch (e) {
            parsedCats = rawCatsBodyU
              .split(',')
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
          }
        }
        if (
          Array.isArray(parsedCats) &&
          parsedCats.length > 0 &&
          typeof parsedCats[0] === 'object'
        ) {
          body.categoryIds = parsedCats
            .map((c: any) => Number(c.id))
            .filter((n: any) => !Number.isNaN(n));
        } else if (Array.isArray(parsedCats)) {
          body.categoryIds = parsedCats
            .map((c: any) => Number(c))
            .filter((n: any) => !Number.isNaN(n));
        }
      } catch (e) {
        // ignore
      }
    }

    if (image) body.imageURL = `uploads/products/${image.filename}`;
    else {
      const incomingImageU = body?.imageURL ?? body?.imageUrl;
      if (
        incomingImageU &&
        typeof incomingImageU === 'string' &&
        incomingImageU.startsWith('data:')
      )
        body.imageURL = saveBase64Image(incomingImageU);
      else if (incomingImageU && typeof incomingImageU === 'string')
        body.imageURL = incomingImageU;
    }

    const updateProductoDto = plainToInstance(UpdateProductoDto, body);
    const errors = validateSync(updateProductoDto, {
      skipMissingProperties: true,
    });
    if (errors && errors.length > 0) {
      const messages = flattenValidationErrors(errors);
      try {
        await this.logsService.createFailureLog(
          'UPDATE_PRODUCT_FAILED',
          req.user?.id,
          `Errores de validación: ${JSON.stringify(messages)}`,
        );
      } catch (e) {}
      throw new BadRequestException({
        message: messages,
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const result = await this.productoService.update(
      id,
      updateProductoDto as any,
    );
    await this.logsService.createSuccessLog(
      'UPDATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} actualizó producto ID: ${id}`,
    );
    return result;
  }
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.productoService.delete(id);
    await this.logsService.createSuccessLog(
      'DELETE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} eliminó producto ID: ${id}`,
    );
    return result;
  }
}
