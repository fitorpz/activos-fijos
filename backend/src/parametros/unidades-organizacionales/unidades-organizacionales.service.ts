import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadOrganizacional } from './entities/unidad-organizacional.entity';
import { CreateUnidadOrganizacionalDto } from './dto/create-unidad-organizacional.dto';
import { UpdateUnidadOrganizacionalDto } from './dto/update-unidad-organizacional.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class UnidadesOrganizacionalesService {
  constructor(
    @InjectRepository(UnidadOrganizacional)
    private readonly unidadRepo: Repository<UnidadOrganizacional>,
  ) { }

  async create(dto: CreateUnidadOrganizacionalDto): Promise<UnidadOrganizacional> {
    const nueva = this.unidadRepo.create(dto);
    return await this.unidadRepo.save(nueva);
  }

  async findAll(): Promise<UnidadOrganizacional[]> {
    return await this.unidadRepo.find({
      where: { deleted_at: IsNull() },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<UnidadOrganizacional> {
    const unidad = await this.unidadRepo.findOne({ where: { id } });
    if (!unidad) throw new NotFoundException('Unidad organizacional no encontrada');
    return unidad;
  }

  async update(id: number, dto: UpdateUnidadOrganizacionalDto): Promise<UnidadOrganizacional> {
    const unidad = await this.unidadRepo.preload({ id, ...dto });
    if (!unidad) throw new NotFoundException('Unidad organizacional no encontrada');
    return await this.unidadRepo.save(unidad);
  }

  async remove(id: number): Promise<void> {
    const unidad = await this.findOne(id);
    await this.unidadRepo.softRemove(unidad);
  }

  async restaurar(id: number): Promise<void> {
    await this.unidadRepo.restore(id);
  }
}
