import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbientesService } from './ambientes.service';
import { AmbientesController } from './ambientes.controller';
import { Ambiente } from './entities/ambiente.entity';
import { UnidadOrganizacional } from '../unidades-organizacionales/entities/unidad-organizacional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ambiente, UnidadOrganizacional]),
  ],
  controllers: [AmbientesController],
  providers: [AmbientesService],
})
export class AmbientesModule { }
