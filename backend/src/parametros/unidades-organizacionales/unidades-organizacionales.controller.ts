import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UnidadesOrganizacionalesService } from './unidades-organizacionales.service';
import { CreateUnidadOrganizacionalDto } from './dto/create-unidad-organizacional.dto';
import { UpdateUnidadOrganizacionalDto } from './dto/update-unidad-organizacional.dto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { UnidadOrganizacional } from './entities/unidad-organizacional.entity'; // ✅ asegúrate de que este path esté correcto

@Controller('parametros/unidades-organizacionales')
@UseGuards(AuthGuard('jwt'))
export class UnidadesOrganizacionalesController {
  constructor(
    private readonly unidadesService: UnidadesOrganizacionalesService, // ✅ usa el mismo nombre
  ) { }

  @Post()
  async create(
    @Body() dto: CreateUnidadOrganizacionalDto,
    @Req() req: RequestWithUser,
  ) {
    dto.creado_por_id = req.user.id;
    return this.unidadesService.create(dto); // ✅ nombre corregido
  }

  @Get()
  findAll(): Promise<UnidadOrganizacional[]> {
    return this.unidadesService.findAll(); // ✅ nombre corregido
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnidadOrganizacionalDto,
    @Req() req: RequestWithUser,
  ) {
    dto.actualizado_por_id = req.user.id;
    return this.unidadesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.restaurar(id);
  }
}
