import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('marcas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarcaController {
  constructor(
    private readonly service: MarcaService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/brands';
          try {
            fs.mkdirSync(uploadPath, { recursive: true });
          } catch (e) {
            // ignore if exists or cannot create
          }
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
  async create(
    @Body() dto: CreateMarcaDto,
    @UploadedFile() logo: any,
    @Request() req,
  ) {
    if (logo) {
      // almacenar la ruta relativa al archivo para guardarla en BD
      dto.logo = `uploads/brands/${logo.filename}`;
    }
    const result = await this.service.create(dto);
    await this.logsService.createSuccessLog(
      'CREATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} creó marca: ${dto.name}`,
    );
    return result;
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.service.findByName(name);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/brands';
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
    @Body() dto: UpdateMarcaDto,
    @UploadedFile() logo: any,
    @Request() req,
  ) {
    if (logo) {
      dto.logo = `uploads/brands/${logo.filename}` as any;
    }
    const result = await this.service.update(id, dto);
    await this.logsService.createSuccessLog(
      'UPDATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} actualizó marca ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.service.remove(id);
    await this.logsService.createSuccessLog(
      'DELETE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} eliminó marca ID: ${id}`,
    );
    return result;
  }
}
