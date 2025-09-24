import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edificio } from './entities/edificio.entity';
import { CreateEdificioDto } from './dto/create-edificio.dto';
import { UpdateEdificioDto } from './dto/update-edificio.dto';
import { Area } from '../../parametros/areas/entities/areas.entity';
import { UnidadOrganizacional } from '../../parametros/unidades-organizacionales/entities/unidad-organizacional.entity';
import { Ambiente } from '../../parametros/ambientes/entities/ambiente.entity';



@Injectable()
export class EdificiosService {
    constructor(
        @InjectRepository(Edificio)
        private readonly edificioRepository: Repository<Edificio>,

        @InjectRepository(Area)
        private readonly areaRepository: Repository<Area>,

        @InjectRepository(UnidadOrganizacional)
        private readonly unidadRepository: Repository<UnidadOrganizacional>,

        @InjectRepository(Ambiente)
        private readonly ambienteRepository: Repository<Ambiente>,
    ) { }

    // ✅ Crear nuevo edificio con trazabilidad
    async create(dto: CreateEdificioDto, userId: number): Promise<Edificio> {
        // Validar duplicado por código
        const existente = await this.edificioRepository.findOneBy({
            codigo_311: dto.codigo_311,
        });

        if (existente) {
            throw new BadRequestException(
                `Ya existe un edificio con código ${dto.codigo_311}`,
            );
        }

        // Crear instancia del edificio con los datos del DTO
        const nuevo = this.edificioRepository.create({
            ...dto,
            creado_por: userId,
            actualizado_por: userId,
        });

        // Buscar y asignar nombres de Área
        if (dto.area_id) {
            const area = await this.areaRepository.findOne({ where: { id: dto.area_id } });
            nuevo.nombre_area = area?.descripcion?.toUpperCase() || '-';
            nuevo.codigo_area = area?.codigo || '-';
        }

        // Buscar y asignar nombre de Unidad Organizacional
        if (dto.unidad_organizacional_id) {
            const unidad = await this.unidadRepository.findOne({ where: { id: dto.unidad_organizacional_id } });
            nuevo.unidad_organizacional_nombre = unidad?.descripcion?.toUpperCase() || '-';
        }

        // Buscar y asignar nombre de Ambiente
        if (dto.ambiente_id) {
            const ambiente = await this.ambienteRepository.findOne({ where: { id: dto.ambiente_id } });
            nuevo.ambiente_nombre = ambiente?.descripcion?.toUpperCase() || '-';
        }

        return await this.edificioRepository.save(nuevo);
    }


    async findAll(estado?: string): Promise<Edificio[]> {
        const where = estado && estado !== 'todos' ? { estado } : {};
        return await this.edificioRepository.find({
            where,
            relations: ['creadoPor', 'actualizadoPor'],
            order: { id_311: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Edificio> {
        const edificio = await this.edificioRepository.findOne({
            where: { id_311: id },
            withDeleted: false,
        });

        if (!edificio) {
            throw new NotFoundException(`Edificio con ID ${id} no encontrado`);
        }

        return edificio;
    }

    // ✅ Actualizar edificio con trazabilidad
    async update(id: number, dto: UpdateEdificioDto, userId: number): Promise<Edificio> {
        const edificio = await this.findOne(id);
        const actualizado = this.edificioRepository.merge(edificio, {
            ...dto,
            actualizado_por: userId,
        });

        return await this.edificioRepository.save(actualizado);
    }

    // Desactivar un edificio (cambiar a INACTIVO)
    async remove(id: number): Promise<{ message: string }> {
        const edificio = await this.findOne(id);
        edificio.estado = 'INACTIVO';
        await this.edificioRepository.save(edificio);

        return {
            message: `Edificio con ID ${id} marcado como INACTIVO`,
        };
    }

    // Activar un edificio (cambiar a ACTIVO)
    async restore(id: number): Promise<{ message: string }> {
        const edificio = await this.findOne(id);
        edificio.estado = 'ACTIVO';
        await this.edificioRepository.save(edificio);

        return {
            message: `Edificio con ID ${id} marcado como ACTIVO`,
        };
    }

}
