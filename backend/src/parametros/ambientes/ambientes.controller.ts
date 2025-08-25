import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AmbientesService } from './ambientes.service';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/interfaces/request-with-user.interface';

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
  findAll() {
    return this.ambientesService.findAll();
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ambientesService.remove(id);
  }
}
