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
import { Ciudad } from './entities/ciudades.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCiudadesDto } from './dto/create-ciudades.dto';
import { UpdateCiudadesDto } from './dto/update-ciudades.dto';
import { CiudadesService } from './ciudades.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('parametros/ciudades')
@UseGuards(JwtAuthGuard)
export class CiudadesController {
  constructor(
    private readonly direccionesService: CiudadesService,

    @InjectRepository(Ciudad)
    private readonly areaRepository: Repository<Ciudad>,
  ) { }

  @Post()
  create(
    @Body() dto: CreateCiudadesDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.create(dto, userId);
  }

  @Get()
  findAll(): Promise<Ciudad[]> {
    return this.areaRepository.find();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCiudadesDto,
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
