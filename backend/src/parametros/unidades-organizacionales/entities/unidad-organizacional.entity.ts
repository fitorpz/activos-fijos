import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('unidades_organizacionales')
export class UnidadOrganizacional {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column()
    descripcion: string;

    @Column()
    area: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at?: Date;

    @ManyToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'creado_por_id' })
    creado_por: Usuario;

    @ManyToOne(() => Usuario, { eager: true, nullable: true })
    @JoinColumn({ name: 'actualizado_por_id' })
    actualizado_por?: Usuario;
}
