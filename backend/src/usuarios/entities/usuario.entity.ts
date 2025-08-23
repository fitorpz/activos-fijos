import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { RolUsuario } from '../enums/rol-usuario.enum';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    correo: string;

    @Column()
    contrasena: string;

    @Column({
        type: 'enum',
        enum: RolUsuario,
        default: RolUsuario.VISITANTE,
    })
    rol: RolUsuario;

    @Column({ nullable: true })
    nombre: string;

    // ✅ Campo explícito para guardar el ID del creador
    @Column({ nullable: true })
    creadoPorId: number;

    // ✅ Relación con el usuario que lo creó
    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'creadoPorId' }) // ← VINCULA la relación
    creadoPor: Usuario;

    @CreateDateColumn()
    creadoEn: Date;
    
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date | null; // 👈 Agrega "| null"


}
