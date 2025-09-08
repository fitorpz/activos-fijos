import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from './entities/ciudades.entity';
import { CreateCiudadesDto } from './dto/create-ciudades.dto';
import { UpdateCiudadesDto } from './dto/update-ciudades.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class CiudadesService {
  constructor(
    @InjectRepository(Ciudad)
    private readonly direccionRepo: Repository<Ciudad>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  // Crear una nueva area
  async create(
    dto: CreateCiudadesDto,
    userId: number,
  ): Promise<Ciudad> {
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
  async findAll(): Promise<Ciudad[]> {
    return this.direccionRepo.find({
      order: { id: 'DESC' },
      relations: ['creado_por', 'actualizado_por'],
    });
  }

  // Obtener una sola dirección por ID
  async findOne(id: number): Promise<Ciudad> {
    const direccion = await this.direccionRepo.findOne({
      where: { id },
      relations: ['creado_por', 'actualizado_por'],
    });

    if (!direccion) {
      throw new NotFoundException(`Nucleo ${id} no encontrada`);
    }

    return direccion;
  }

  // Actualizar una dirección
  async update(
    id: number,
    dto: UpdateCiudadesDto,
    userId: number,
  ): Promise<Ciudad> {
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
      return { message: 'Ciudad eliminada correctamente' };
    } catch (error) {
      console.error('❌ Error al eliminar ciudad:', error);
      throw new Error('Error interno al intentar eliminar la ciudad.');
    }
  }
}
