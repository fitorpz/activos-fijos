import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UnidadOrganizacional } from 'src/parametros/unidades-organizacionales/entities/unidad-organizacional.entity';

@Entity('ambientes')
export class Ambiente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => UnidadOrganizacional, { eager: true })
    @JoinColumn({ name: 'unidad_organizacional_id' })
    unidad_organizacional: UnidadOrganizacional;

    @ManyToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'creado_por_id' })
    creado_por: Usuario;

    @ManyToOne(() => Usuario, { eager: true, nullable: true })
    @JoinColumn({ name: 'actualizado_por_id' })
    actualizado_por?: Usuario;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at?: Date;
}
