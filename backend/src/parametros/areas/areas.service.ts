import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './entities/areas.entity';
import { CreateAreasDto } from './dto/create-areas.dto';
import { UpdateAreasDto } from './dto/update-areas.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly direccionRepo: Repository<Area>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  // Crear una nueva area
  async create(
    dto: CreateAreasDto,
    userId: number,
  ): Promise<Area> {
    const usuario = await this.usuarioRepo.findOneBy({ id: userId });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const nuevaDireccion = this.direccionRepo.create({
      ...dto,
      estado: dto.estado ?? 'ACTIVO', // valor por defecto si no se manda
      creado_por: usuario,
    });

    return this.direccionRepo.save(nuevaDireccion);
  }

  // Obtener todas las direcciones
  // areas.service.ts
  async findAll(estado?: string): Promise<Area[]> {
    const query = this.direccionRepo.createQueryBuilder('area')
      .leftJoinAndSelect('area.creado_por', 'creado_por')
      .orderBy('area.id', 'DESC');

    if (estado && estado !== 'todos') {
      query.andWhere('area.estado = :estado', { estado: estado.toUpperCase() });
    }

    return query.getMany();
  }


  // Obtener una sola dirección por ID
  async findOne(id: number): Promise<Area> {
    const direccion = await this.direccionRepo.findOne({
      where: { id },
      relations: ['creado_por', 'actualizado_por'],
    });

    if (!direccion) {
      throw new NotFoundException(`Area ${id} no encontrada`);
    }

    return direccion;
  }

  // Actualizar una dirección
  async update(
    id: number,
    dto: UpdateAreasDto,
    userId: number,
  ): Promise<Area> {
    const direccion = await this.findOne(id);

    const usuario = await this.usuarioRepo.findOneBy({ id: userId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (dto.codigo !== undefined) {
      direccion.codigo = dto.codigo;
    }

    if (dto.descripcion !== undefined) {
      direccion.descripcion = dto.descripcion;
    }

    if (dto.estado !== undefined) {
      direccion.estado = dto.estado;
    }

    direccion.actualizado_por = usuario;

    return this.direccionRepo.save(direccion);
  }

  // Eliminar (soft delete)
  async remove(id: number): Promise<{ message: string }> {
    const area = await this.direccionRepo.findOne({ where: { id } });

    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    area.estado = 'INACTIVO'; // o 'ACTIVO' si deseas volver a activar
    await this.direccionRepo.save(area);

    return { message: 'Área marcada como INACTIVA' };
  }
  async cambiarEstado(id: number): Promise<{ nuevoEstado: string; message: string }> {
    const area = await this.direccionRepo.findOne({ where: { id } });

    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    area.estado = area.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    await this.direccionRepo.save(area);

    return {
      nuevoEstado: area.estado,
      message: `Área actualizada a estado ${area.estado}`,
    };
  }


}
