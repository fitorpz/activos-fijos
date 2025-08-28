import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { AmbientesService } from './ambientes.service';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { generarPDFDesdeHTML } from '../../pdf/generarPDF';

@Controller('parametros/ambientes')
@UseGuards(JwtAuthGuard)
export class AmbientesController {
  constructor(private readonly ambientesService: AmbientesService) { }

  @Post()
  create(
    @Body() dto: CreateAmbienteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ambientesService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('estado') estado: string) {
    return this.ambientesService.findAll(estado);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ambientesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAmbienteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ambientesService.update(id, dto, req.user.id);
  }

  // ✅ Cambio de estado (ACTIVO/INACTIVO)
  @Put(':id/cambiar-estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ambientesService.cambiarEstado(id, req.user.id);
  }

  // ✅ Exportar PDF
  @Get('exportar/pdf')
  async exportarPDF(
    @Res() res: Response,
    @Query('estado') estado: string,
  ) {
    try {
      const ambientes = await this.ambientesService.findAll(estado);

      const filasHTML = ambientes.map((ambiente, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${ambiente.unidad_organizacional?.area?.codigo || '—'}</td>
          <td>${ambiente.unidad_organizacional?.codigo || '—'}</td>
          <td>${ambiente.codigo}</td>
          <td>${ambiente.descripcion}</td>
        </tr>
      `).join('');

      const templatePath = path.join(
        process.cwd(),
        'templates',
        'pdf',
        'parametros',
        'ambientes-pdf.html',
      );

      let html: string;
      try {
        html = fs.readFileSync(templatePath, 'utf-8');
      } catch (e) {
        console.error('❌ Plantilla PDF no encontrada:', templatePath);
        throw new Error('Plantilla HTML no encontrada');
      }

      html = html.replace('<!-- FILAS_AMBIENTES -->', filasHTML);

      const buffer = await generarPDFDesdeHTML(html);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=ambientes.pdf');
      res.end(buffer);
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      return res.status(500).json({ message: 'Error al exportar PDF' });
    }
  }
}
