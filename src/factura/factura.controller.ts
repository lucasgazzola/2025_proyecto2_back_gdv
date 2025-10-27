import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';

@Controller('facturas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacturaController {
  constructor(
    private readonly service: FacturaService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  // Accept raw body (any) to allow several incoming shapes (product objects, ids with suffixes, customer object)
  async create(@Body() data: any, @Request() req) {
    const userEmail = req.user.email;
    if (!userEmail) {
      try {
        await this.logsService.createFailureLog(
          'CREATE_INVOICE_FAILED',
          undefined,
          'User email not found in request',
        );
      } catch (e) {}
      throw new ForbiddenException('User email not found in request');
    }
    const result = await this.service.create(data, userEmail);
    await this.logsService.createSuccessLog(
      'CREATE_INVOICE',
      req.user.id,
      `Usuario ${userEmail} creó factura ID: ${result.id}`,
    );
    return result;
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_INVOICES',
        req.user?.id,
        `Usuario ${req.user?.email} listó facturas`,
      );
    } catch (e) {}
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async findById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_INVOICE',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó factura ID: ${id}`,
      );
    } catch (e) {}
    return this.service.findById(id);
  }

  @Post(':id/state')
  @Roles(Role.ADMIN, Role.USER)
  async changeState(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { state: 'PAID' | 'CANCELLED' },
    @Request() req,
  ) {
    if (!body || !body.state) {
      try {
        await this.logsService.createFailureLog(
          'CHANGE_INVOICE_STATE_FAILED',
          undefined,
          `state es requerido para factura ID: ${id}`,
        );
      } catch (e) {}
      throw new BadRequestException('state es requerido');
    }
    const result = await this.service.changeState(id, body.state);
    try {
      await this.logsService.createSuccessLog(
        'VALIDATE_TOKEN',
        req.user.id,
        `Factura ID: ${id} cambió a estado ${body.state}`,
      );
    } catch (e) {}
    return result;
  }
}
