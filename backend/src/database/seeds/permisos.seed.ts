// src/database/seeds/permisos.seed.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../../usuarios/entities/permiso.entity';

@Injectable()
export class PermisosSeed implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Permiso)
        private readonly permisoRepository: Repository<Permiso>,
    ) { }

    async onApplicationBootstrap() {
        const permisos = [
            //  Permisos para GRUPOS CONTABLES
            { nombre: 'grupos-contables:listar', descripcion: 'Acceso al listado de grupos contables', modulo: 'Grupos Contables' },
            { nombre: 'grupos-contables:crear', descripcion: 'Crear nuevos grupos contables', modulo: 'Grupos Contables' },
            { nombre: 'grupos-contables:editar', descripcion: 'Editar grupos contables existentes', modulo: 'Grupos Contables' },
            { nombre: 'grupos-contables:cambiar-estado', descripcion: 'Activar o desactivar grupos contables', modulo: 'Grupos Contables' },
            { nombre: 'grupos-contables:exportar-pdf', descripcion: 'Exportar reporte PDF de grupos contables', modulo: 'Grupos Contables' },

            //  Permisos para AUXILIARES
            { nombre: 'auxiliares:listar', descripcion: 'Acceso al listado de auxiliares', modulo: 'Auxiliares' },
            { nombre: 'auxiliares:crear', descripcion: 'Registrar nuevos auxiliares', modulo: 'Auxiliares' },
            { nombre: 'auxiliares:editar', descripcion: 'Editar auxiliares existentes', modulo: 'Auxiliares' },
            { nombre: 'auxiliares:cambiar-estado', descripcion: 'Activar o desactivar auxiliares', modulo: 'Auxiliares' },
            { nombre: 'auxiliares:exportar-pdf', descripcion: 'Exportar reporte PDF de auxiliares', modulo: 'Auxiliares' },

            //  Permisos para ÁREAS
            { nombre: 'areas:listar', descripcion: 'Acceso al listado de áreas', modulo: 'Áreas' },
            { nombre: 'areas:crear', descripcion: 'Registrar nuevas áreas', modulo: 'Áreas' },
            { nombre: 'areas:editar', descripcion: 'Editar áreas existentes', modulo: 'Áreas' },
            { nombre: 'areas:cambiar-estado', descripcion: 'Activar o desactivar áreas', modulo: 'Áreas' },
            { nombre: 'areas:exportar-pdf', descripcion: 'Exportar reporte PDF de áreas', modulo: 'Áreas' },

            //  Permisos para UNIDADES ORGANIZACIONALES
            { nombre: 'unidades-organizacionales:listar', descripcion: 'Acceso al listado de unidades organizacionales', modulo: 'Unidades Organizacionales' },
            { nombre: 'unidades-organizacionales:crear', descripcion: 'Registrar nuevas unidades organizacionales', modulo: 'Unidades Organizacionales' },
            { nombre: 'unidades-organizacionales:editar', descripcion: 'Editar unidades organizacionales existentes', modulo: 'Unidades Organizacionales' },
            { nombre: 'unidades-organizacionales:cambiar-estado', descripcion: 'Activar o desactivar unidades organizacionales', modulo: 'Unidades Organizacionales' },
            { nombre: 'unidades-organizacionales:exportar-pdf', descripcion: 'Exportar reporte PDF de unidades organizacionales', modulo: 'Unidades Organizacionales' },

            //  Permisos para AMBIENTES
            { nombre: 'ambientes:listar', descripcion: 'Acceso al listado de ambientes', modulo: 'Ambientes' },
            { nombre: 'ambientes:crear', descripcion: 'Registrar nuevos ambientes', modulo: 'Ambientes' },
            { nombre: 'ambientes:editar', descripcion: 'Editar ambientes existentes', modulo: 'Ambientes' },
            { nombre: 'ambientes:cambiar-estado', descripcion: 'Activar o desactivar ambientes', modulo: 'Ambientes' },
            { nombre: 'ambientes:exportar-pdf', descripcion: 'Exportar reporte PDF de ambientes', modulo: 'Ambientes' },

            //  Permisos para DIRECCIONES ADMINISTRATIVAS
            { nombre: 'direcciones-administrativas:listar', descripcion: 'Acceso al listado de direcciones administrativas', modulo: 'Direcciones Administrativas' },
            { nombre: 'direcciones-administrativas:crear', descripcion: 'Registrar nuevas direcciones administrativas', modulo: 'Direcciones Administrativas' },
            { nombre: 'direcciones-administrativas:editar', descripcion: 'Editar direcciones administrativas existentes', modulo: 'Direcciones Administrativas' },
            { nombre: 'direcciones-administrativas:cambiar-estado', descripcion: 'Activar o desactivar direcciones administrativas', modulo: 'Direcciones Administrativas' },
            { nombre: 'direcciones-administrativas:exportar-pdf', descripcion: 'Exportar reporte PDF de direcciones administrativas', modulo: 'Direcciones Administrativas' },

            //  Permisos para CIUDADES
            { nombre: 'ciudades:listar', descripcion: 'Acceso al listado de ciudades', modulo: 'Ciudades' },
            { nombre: 'ciudades:crear', descripcion: 'Registrar nuevas ciudades', modulo: 'Ciudades' },
            { nombre: 'ciudades:editar', descripcion: 'Editar ciudades existentes', modulo: 'Ciudades' },
            { nombre: 'ciudades:cambiar-estado', descripcion: 'Activar o desactivar ciudades', modulo: 'Ciudades' },
            { nombre: 'ciudades:exportar-pdf', descripcion: 'Exportar reporte PDF de ciudades', modulo: 'Ciudades' },

            //  Permisos para NÚCLEOS
            { nombre: 'nucleos:listar', descripcion: 'Acceso al listado de núcleos', modulo: 'Núcleos' },
            { nombre: 'nucleos:crear', descripcion: 'Registrar nuevos núcleos', modulo: 'Núcleos' },
            { nombre: 'nucleos:editar', descripcion: 'Editar núcleos existentes', modulo: 'Núcleos' },
            { nombre: 'nucleos:cambiar-estado', descripcion: 'Activar o desactivar núcleos', modulo: 'Núcleos' },
            { nombre: 'nucleos:exportar-pdf', descripcion: 'Exportar reporte PDF de núcleos', modulo: 'Núcleos' },

            //  Permisos para DISTRITOS
            { nombre: 'distritos:listar', descripcion: 'Acceso al listado de distritos', modulo: 'Distritos' },
            { nombre: 'distritos:crear', descripcion: 'Registrar nuevos distritos', modulo: 'Distritos' },
            { nombre: 'distritos:editar', descripcion: 'Editar distritos existentes', modulo: 'Distritos' },
            { nombre: 'distritos:cambiar-estado', descripcion: 'Activar o desactivar distritos', modulo: 'Distritos' },
            { nombre: 'distritos:exportar-pdf', descripcion: 'Exportar reporte PDF de distritos', modulo: 'Distritos' },

            //  Permisos para PERSONALES
            { nombre: 'personales:listar', descripcion: 'Acceso al listado de personales', modulo: 'Personales' },
            { nombre: 'personales:crear', descripcion: 'Registrar nuevo personal', modulo: 'Personales' },
            { nombre: 'personales:editar', descripcion: 'Editar registros de personal', modulo: 'Personales' },
            { nombre: 'personales:cambiar-estado', descripcion: 'Activar o desactivar registros de personal', modulo: 'Personales' },
            { nombre: 'personales:exportar-pdf', descripcion: 'Exportar reporte PDF de personales', modulo: 'Personales' },

            //  Permisos para CARGOS
            { nombre: 'cargos:listar', descripcion: 'Acceso al listado de cargos', modulo: 'Cargos' },
            { nombre: 'cargos:crear', descripcion: 'Registrar nuevos cargos', modulo: 'Cargos' },
            { nombre: 'cargos:editar', descripcion: 'Editar cargos existentes', modulo: 'Cargos' },
            { nombre: 'cargos:cambiar-estado', descripcion: 'Activar o desactivar cargos', modulo: 'Cargos' },
            { nombre: 'cargos:exportar-pdf', descripcion: 'Exportar reporte PDF de cargos', modulo: 'Cargos' },

        ];

        for (const permiso of permisos) {
            const existente = await this.permisoRepository.findOne({ where: { nombre: permiso.nombre } });
            if (!existente) {
                await this.permisoRepository.save(this.permisoRepository.create(permiso));
                console.log(`✅ Permiso creado: ${permiso.nombre}`);
            }
        }

        console.log('🚀 Seed de permisos completado.');
    }
}
