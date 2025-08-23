import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DireccionAdministrativa } from './entities/direcciones-administrativas.entity';
import { CreateDireccionesAdministrativasDto } from './dto/create-direcciones-administrativa.dto';
import { UpdateDireccionesAdministrativasDto } from './dto/update-direcciones-administrativa.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class DireccionesAdministrativasService {
  constructor(
    @InjectRepository(DireccionAdministrativa)
    private readonly direccionRepo: Repository<DireccionAdministrativa>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  // Crear una nueva dirección administrativa
  async create(
    dto: CreateDireccionesAdministrativasDto,
    userId: number,
  ): Promise<DireccionAdministrativa> {
    const usuario = await this.usuarioRepo.findOneBy({ id: userId });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const nuevaDireccion = this.direccionRepo.create({
      ...dto,
      creado_por: usuario,
    });

    return this.direccionRepo.save(nuevaDireccion);
  }

  // Obtener todas las direcciones
  async findAll(): Promise<DireccionAdministrativa[]> {
    return this.direccionRepo.find({
      order: { id: 'DESC' },
      relations: ['creado_por', 'actualizado_por'],
    });
  }

  // Obtener una sola dirección por ID
  async findOne(id: number): Promise<DireccionAdministrativa> {
    const direccion = await this.direccionRepo.findOne({
      where: { id },
      relations: ['creado_por', 'actualizado_por'],
    });

    if (!direccion) {
      throw new NotFoundException(`Dirección Administrativa ${id} no encontrada`);
    }

    return direccion;
  }

  // Actualizar una dirección
  async update(
    id: number,
    dto: UpdateDireccionesAdministrativasDto,
    userId: number,
  ): Promise<DireccionAdministrativa> {
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

    direccion.actualizado_por = usuario;


    return this.direccionRepo.save(direccion);
  }

  // Eliminar (soft delete)
  async remove(id: number): Promise<{ message: string }> {
    try {
      const direccion = await this.findOne(id);
      await this.direccionRepo.softRemove(direccion);
      return { message: 'Dirección administrativa eliminada correctamente' };
    } catch (error) {
      console.error('❌ Error al eliminar dirección administrativa:', error);
      throw new Error('Error interno al intentar eliminar la dirección administrativa.');
    }
  }
}
