import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdificiosService } from './edificios.service';
import { EdificiosController } from './edificios.controller';
import { Edificio } from './entities/edificio.entity';
import { Area } from 'src/parametros/areas/entities/areas.entity';
import { UnidadOrganizacional } from 'src/parametros/unidades-organizacionales/entities/unidad-organizacional.entity';
import { Ambiente } from 'src/parametros/ambientes/entities/ambiente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Edificio, Area, UnidadOrganizacional, Ambiente]),
    // 👇 Agrega también los módulos de donde vienen esas entidades si están en módulos separados
    // Por ejemplo:
    // AreasModule,
    // UnidadesOrganizacionalesModule,
    // AmbientesModule,
  ],
  controllers: [EdificiosController],
  providers: [EdificiosService],
})
export class EdificiosModule { }
