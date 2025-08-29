import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoContable } from './entities/grupos-contables.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGruposContablesDto } from './dto/create-grupos-contables.dto';
import { UpdateGruposContablesDto } from './dto/update-grupos-contables.dto';
import { GruposContablesService } from './grupos-contables.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import type { Response } from 'express';

import * as fs from 'fs';
import * as path from 'path';
import { generarPDFDesdeHTML } from '../../pdf/generarPDF';

@Controller('parametros/grupos-contables')
@UseGuards(JwtAuthGuard)
export class GruposContablesController {
  constructor(
    private readonly gruposService: GruposContablesService,

    @InjectRepository(GrupoContable)
    private readonly grupoRepository: Repository<GrupoContable>,
  ) { }

  @Post()
  create(
    @Body() dto: CreateGruposContablesDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.gruposService.create(dto, userId);
  }

  @Get()
  findAll(@Query('estado') estado: string) {
    return this.gruposService.findAll(estado);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGruposContablesDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.gruposService.update(id, dto, userId);
  }

  @Put(':id/cambiar-estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.gruposService.cambiarEstado(id, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.remove(id);
  }

  @Get('exportar/pdf')
  async exportarPDF(
    @Res() res: Response,
    @Query('estado') estado: string,
  ) {
    try {
      const grupos = await this.gruposService.findAll(estado);

      const filasHTML = grupos.map((grupo, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${grupo.codigo}</td>
          <td>${grupo.descripcion}</td>
          <td>${grupo.tiempo}</td>
          <td>${grupo.porcentaje}</td>
        </tr>
      `).join('');

      const templatePath = path.join(
        process.cwd(),
        'templates',
        'pdf',
        'parametros',
        'grupos-contables-pdf.html',
      );

      let html: string;
      try {
        html = fs.readFileSync(templatePath, 'utf-8');
      } catch (e) {
        console.error('❌ Plantilla PDF no encontrada:', templatePath);
        throw new Error('Plantilla HTML no encontrada');
      }

      html = html.replace('<!-- FILAS_GRUPOS_CONTABLES -->', filasHTML);

      const buffer = await generarPDFDesdeHTML(html);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=grupos-contables.pdf');
      res.end(buffer);
    } catch (error) {
      console.error('❌ Error al generar el PDF:', error);
      return res.status(500).json({ message: 'Error al exportar PDF' });
    }
  }
}
