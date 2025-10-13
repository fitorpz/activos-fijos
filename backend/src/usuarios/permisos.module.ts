// src/usuarios/permisos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Permiso])],
    controllers: [PermisosController],
    providers: [PermisosService],
    exports: [PermisosService],
})
export class PermisosModule { }
