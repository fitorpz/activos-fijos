import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nucleo } from './entities/nucleos.entity';
import { CreateNucleosDto } from './dto/create-nucleos.dto';
import { UpdateNucleosDto } from './dto/update-nucleos.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class NucleosService {
  constructor(
    @InjectRepository(Nucleo)
    private readonly direccionRepo: Repository<Nucleo>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  // Crear una nueva area
  async create(
    dto: CreateNucleosDto,
    userId: number,
  ): Promise<Nucleo> {
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
  async findAll(): Promise<Nucleo[]> {
    return this.direccionRepo.find({
      order: { id: 'DESC' },
      relations: ['creado_por', 'actualizado_por'],
    });
  }

  // Obtener una sola dirección por ID
  async findOne(id: number): Promise<Nucleo> {
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
    dto: UpdateNucleosDto,
    userId: number,
  ): Promise<Nucleo> {
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
      return { message: 'Nucleo eliminado correctamente' };
    } catch (error) {
      console.error('❌ Error al eliminar nucleo:', error);
      throw new Error('Error interno al intentar eliminar el nucleo.');
    }
  }
}
