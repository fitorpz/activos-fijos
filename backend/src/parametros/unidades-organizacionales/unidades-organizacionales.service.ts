import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UnidadOrganizacional } from './entities/unidad-organizacional.entity';
import { CreateUnidadOrganizacionalDto } from './dto/create-unidad-organizacional.dto';
import { UpdateUnidadOrganizacionalDto } from './dto/update-unidad-organizacional.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class UnidadesOrganizacionalesService {
  constructor(
    @InjectRepository(UnidadOrganizacional)
    private readonly unidadRepo: Repository<UnidadOrganizacional>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  async create(dto: CreateUnidadOrganizacionalDto): Promise<UnidadOrganizacional> {
    const usuario = await this.usuarioRepo.findOneBy({ id: dto.creado_por_id });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.creado_por_id} no encontrado`);

    const nueva = this.unidadRepo.create({
      ...dto,
      estado: dto.estado ?? 'ACTIVO',
      creado_por: usuario,
    });

    return this.unidadRepo.save(nueva);
  }

  async findAll(estado?: string): Promise<UnidadOrganizacional[]> {
    const query = this.unidadRepo.createQueryBuilder('unidad')
      .leftJoinAndSelect('unidad.area', 'area')
      .leftJoinAndSelect('unidad.creado_por', 'creado_por')
      .leftJoinAndSelect('unidad.actualizado_por', 'actualizado_por')
      .where('unidad.deleted_at IS NULL')
      .orderBy('unidad.id', 'ASC');

    if (estado && estado !== 'todos') {
      query.andWhere('unidad.estado = :estado', { estado: estado.toUpperCase() });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<UnidadOrganizacional> {
    const unidad = await this.unidadRepo.findOne({
      where: { id },
      relations: ['area', 'creado_por', 'actualizado_por'],
    });

    if (!unidad) throw new NotFoundException('Unidad organizacional no encontrada');
    return unidad;
  }

  async update(id: number, dto: UpdateUnidadOrganizacionalDto): Promise<UnidadOrganizacional> {
    const unidad = await this.findOne(id);

    if (dto.actualizado_por_id) {
      const usuario = await this.usuarioRepo.findOneBy({ id: dto.actualizado_por_id });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.actualizado_por_id} no encontrado`);
      unidad.actualizado_por = usuario;
    }

    if (dto.codigo !== undefined) unidad.codigo = dto.codigo;
    if (dto.descripcion !== undefined) unidad.descripcion = dto.descripcion;
    if (dto.estado !== undefined) unidad.estado = dto.estado;
    if (dto.area_id !== undefined) unidad.area_id = dto.area_id;

    return this.unidadRepo.save(unidad);
  }

  async remove(id: number): Promise<{ message: string }> {
    const unidad = await this.findOne(id);
    unidad.estado = 'INACTIVO';
    await this.unidadRepo.save(unidad);
    return { message: 'Unidad organizacional marcada como INACTIVA' };
  }

  async cambiarEstado(id: number, userId: number): Promise<UnidadOrganizacional> {
    const unidad = await this.unidadRepo.findOne({
      where: { id },
      relations: ['actualizado_por'],
    });

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada');
    }

    const usuario = await this.usuarioRepo.findOneBy({ id: userId });
    if (!usuario) {
      throw new NotFoundException('Usuario no válido');
    }

    unidad.estado = unidad.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    unidad.actualizado_por = usuario;
    unidad.updated_at = new Date();

    return await this.unidadRepo.save(unidad);
  }


  async restaurar(id: number): Promise<void> {
    await this.unidadRepo.restore(id);
  }
}
