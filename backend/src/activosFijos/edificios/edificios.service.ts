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

@Injectable()
export class EdificiosService {
    constructor(
        @InjectRepository(Edificio)
        private readonly edificioRepository: Repository<Edificio>,
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

        const nuevo = this.edificioRepository.create({
            ...dto,
            creado_por: userId,
            actualizado_por: userId,
        });

        return await this.edificioRepository.save(nuevo);
    }

    // ✅ Obtener todos los edificios
    async findAll(): Promise<Edificio[]> {
        return await this.edificioRepository.find({
            relations: ['creadoPor', 'actualizadoPor'],
            order: { id_311: 'DESC' },
            withDeleted: false,
        });
    }

    // ✅ Obtener edificio por ID
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

    // ✅ Soft delete
    async remove(id: number): Promise<{ message: string }> {
        const edificio = await this.findOne(id);
        await this.edificioRepository.softRemove(edificio);

        return {
            message: `Edificio con ID ${id} eliminado correctamente (soft delete)`,
        };
    }

    // ✅ Restaurar un edificio eliminado
    async restore(id: number): Promise<{ message: string }> {
        const result = await this.edificioRepository.restore(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró el edificio con ID ${id}`);
        }
        return {
            message: `Edificio con ID ${id} restaurado correctamente`,
        };
    }
}
