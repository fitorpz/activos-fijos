import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesOrganizacionalesService } from './unidades-organizacionales.service';
import { UnidadesOrganizacionalesController } from './unidades-organizacionales.controller';
import { UnidadOrganizacional } from './entities/unidad-organizacional.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadOrganizacional, Usuario])],
  controllers: [UnidadesOrganizacionalesController],
  providers: [UnidadesOrganizacionalesService],
})
export class UnidadesOrganizacionalesModule { }
