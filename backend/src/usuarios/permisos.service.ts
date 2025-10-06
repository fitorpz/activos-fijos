import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermisosService {
    constructor(
        @InjectRepository(Permiso)
        private permisoRepository: Repository<Permiso>,
    ) { }

    findAll() { return this.permisoRepository.find(); }
    create(data: any) { return this.permisoRepository.save(data); }
}
