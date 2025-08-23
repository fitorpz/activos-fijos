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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DireccionAdministrativa } from './entities/direcciones-administrativas.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDireccionesAdministrativasDto } from './dto/create-direcciones-administrativa.dto';
import { UpdateDireccionesAdministrativasDto } from './dto/update-direcciones-administrativa.dto';
import { DireccionesAdministrativasService } from './direcciones-administrativas.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('parametros/direcciones-administrativas')
@UseGuards(JwtAuthGuard)
export class DireccionesAdministrativasController {
  constructor(
    private readonly direccionesService: DireccionesAdministrativasService,

    @InjectRepository(DireccionAdministrativa)
    private readonly direccionAdministrativaRepository: Repository<DireccionAdministrativa>,
  ) { }

  @Post()
  create(
    @Body() dto: CreateDireccionesAdministrativasDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.create(dto, userId);
  }

  @Get()
  findAll(): Promise<DireccionAdministrativa[]> {
    return this.direccionAdministrativaRepository.find();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDireccionesAdministrativasDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.update(id, dto, userId);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.remove(id);
  }
}
