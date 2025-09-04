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
  Query
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargos.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCargosDto } from './dto/create-cargos.dto';
import { UpdateCargosDto } from './dto/update-cargos.dto';
import { CargosService } from './cargos.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('parametros/cargos')
@UseGuards(JwtAuthGuard)
export class CargosController {
  constructor(
    private readonly direccionesService: CargosService,

    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) { }

  @Post()
  create(
    @Body() dto: CreateCargosDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.create(dto, userId);
  }

  @Get()
  findAll(@Query('estado') estado?: 'ACTIVO' | 'INACTIVO') {
    return this.direccionesService.findAll(estado);
  }

  @Get('siguiente-codigo')
  async siguienteCodigo(@Query('ambiente_codigo') ambienteCodigo: string) {
    if (!ambienteCodigo) {
      throw new Error('El parámetro ambiente_codigo es obligatorio');
    }

    return this.direccionesService.generarCodigoPorAmbiente(ambienteCodigo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCargosDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.update(id, dto, userId);
  }
  @Put(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: 'ACTIVO' | 'INACTIVO',
    @Req() req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.direccionesService.cambiarEstado(id, estado, userId);
  }

}
