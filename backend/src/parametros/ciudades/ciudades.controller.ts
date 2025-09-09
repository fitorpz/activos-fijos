import {
  Controller, Get, Post, Body, Put, Param, ParseIntPipe, UseGuards, Req, Query, Res
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from './entities/ciudades.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCiudadesDto } from './dto/create-ciudades.dto';
import { UpdateCiudadesDto } from './dto/update-ciudades.dto';
import { CiudadesService } from './ciudades.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { generarPDFDesdeHTML } from '../../pdf/generarPDF';

@Controller('parametros/ciudades')
@UseGuards(JwtAuthGuard)
export class CiudadesController {
  constructor(
    private readonly ciudadesService: CiudadesService,
    @InjectRepository(Ciudad)
    private readonly ciudadRepository: Repository<Ciudad>,
  ) { }

  @Post()
  create(@Body() dto: CreateCiudadesDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.ciudadesService.create(dto, userId);
  }

  @Get('verificar-codigo/:codigo')
  async verificarCodigo(@Param('codigo') codigo: string) {
    const existe = await this.ciudadRepository.findOneBy({
      codigo: codigo.trim().toUpperCase(),
    });
    return { disponible: !existe };
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    const estado = req.query.estado as string;
    return this.ciudadesService.findAll(estado);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCiudadesDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.ciudadesService.update(id, dto, userId);
  }

  @Put(':id/cambiar-estado')
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.ciudadesService.cambiarEstado(id, userId);
  }

  @Get('exportar/pdf')
  async exportarPDF(@Res() res: Response, @Query('estado') estado: string) {
    try {
      const ciudades = await this.ciudadesService.findAll(estado);

      const filasHTML = ciudades.map((ciudad, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${ciudad.codigo}</td>
          <td>${ciudad.descripcion}</td>
          <td>${ciudad.estado}</td>
        </tr>
      `).join('');

      const templatePath = path.join(process.cwd(), 'templates', 'pdf', 'parametros', 'ciudades-pdf.html');
      let html = fs.readFileSync(templatePath, 'utf-8');
      html = html.replace('<!-- FILAS_CIUDADES -->', filasHTML);

      const buffer = await generarPDFDesdeHTML(html);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=ciudades.pdf');
      res.end(buffer);
    } catch (error) {
      console.error('❌ Error al generar el PDF:', error);
      return res.status(500).json({ message: 'Error al exportar PDF' });
    }
  }
}
