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
import { Nucleo } from './entities/nucleos.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNucleosDto } from './dto/create-nucleos.dto';
import { UpdateNucleosDto } from './dto/update-nucleos.dto';
import { NucleosService } from './nucleos.service';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('parametros/nucleos')
@UseGuards(JwtAuthGuard)
export class NucleosController {
  constructor(
    private readonly direccionesService: NucleosService,

    @InjectRepository(Nucleo)
    private readonly areaRepository: Repository<Nucleo>,
  ) { }

  @Post()
  create(
    @Body() dto: CreateNucleosDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.direccionesService.create(dto, userId);
  }

  @Get()
  findAll(): Promise<Nucleo[]> {
    return this.areaRepository.find();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNucleosDto,
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
