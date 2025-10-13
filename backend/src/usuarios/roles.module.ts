// src/usuarios/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuditoriaRolesPermisosService } from 'src/auditoria/auditoria-roles-permisos.service';

@Module({
    imports: [TypeOrmModule.forFeature([Rol, Permiso])],
    controllers: [RolesController],
    providers: [RolesService, AuditoriaRolesPermisosService],
    exports: [RolesService], // Opcional, si necesitas usar el service en otros módulos
})
export class RolesModule { }
