import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargos.entity';
import { CreateCargosDto } from './dto/create-cargos.dto';
import { UpdateCargosDto } from './dto/update-cargos.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private readonly direccionRepo: Repository<Cargo>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  // Crear una nueva area
  async create(
    dto: CreateCargosDto,
    userId: number,
  ): Promise<Cargo> {
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
  async findAll(estado?: 'ACTIVO' | 'INACTIVO'): Promise<Cargo[]> {
    const where = estado ? { estado } : {};
    return this.direccionRepo.find({
      where,
      order: { id: 'DESC' },
      relations: ['creado_por', 'actualizado_por'],
    });
  }


  // Obtener una sola dirección por ID
  async findOne(id: number): Promise<Cargo> {
    const direccion = await this.direccionRepo.findOne({
      where: { id },
      relations: ['creado_por', 'actualizado_por'],
    });

    if (!direccion) {
      throw new NotFoundException(`Cargo ${id} no encontrado`);
    }

    return direccion;
  }

  // Actualizar una dirección
  async update(
    id: number,
    dto: UpdateCargosDto,
    userId: number,
  ): Promise<Cargo> {
    const direccion = await this.findOne(id);

    const usuario = await this.usuarioRepo.findOneBy({ id: userId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (dto.area !== undefined) {
      direccion.area = dto.area;
    }

    if (dto.unidad_organizacional !== undefined) {
      direccion.unidad_organizacional = dto.unidad_organizacional;
    }

    if (dto.estado !== undefined) {
      direccion.estado = dto.estado;
    }

    if (dto.ambiente !== undefined) {
      direccion.ambiente = dto.ambiente;
    }

    if (dto.codigo !== undefined) {
      direccion.codigo = dto.codigo;
    }

    if (dto.cargo !== undefined) {
      direccion.cargo = dto.cargo;
    }

    if (dto.personal1 !== undefined) {
      direccion.personal1 = dto.personal1;
    }

    if (dto.personal2 !== undefined) {
      direccion.personal2 = dto.personal2;
    }

    if (dto.personal3 !== undefined) {
      direccion.personal3 = dto.personal3;
    }

    direccion.actualizado_por = usuario;


    return this.direccionRepo.save(direccion);
  }

  async cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO', userId: number): Promise<Cargo> {
    const cargo = await this.findOne(id);

    const usuario = await this.usuarioRepo.findOneBy({ id: userId });
    if (!usuario) throw new NotFoundException(`Usuario ${userId} no encontrado`);

    cargo.estado = estado;
    cargo.actualizado_por = usuario;
    return this.direccionRepo.save(cargo);
  }

  async generarCodigoPorAmbiente(ambienteCodigo: string): Promise<{ codigo: string }> {
    // Contar cargos que ya usan ese ambiente
    const total = await this.direccionRepo
      .createQueryBuilder('cargo')
      .where('cargo.ambiente = :ambienteCodigo', { ambienteCodigo })
      .getCount();

    const correlativo = (total + 1).toString().padStart(2, '0');
    const codigoFinal = `${ambienteCodigo}.${correlativo}`;

    return { codigo: codigoFinal };
  }



}
