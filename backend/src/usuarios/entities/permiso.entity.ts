import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permisos')
export class Permiso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    modulo: string;
}