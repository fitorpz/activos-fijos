import {
  Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, ManyToOne,
  JoinColumn
} from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
@Entity('edificios')
export class Edificio {
  @PrimaryGeneratedColumn()
  id_311: number;

  // ✅ Campos obligatorios (ya implementados en Datos Generales)
  @Column({ nullable: true })
  codigo_311: string;

  @Column({ nullable: true })
  ingreso_311: string;

  @Column({ nullable: true })
  ingreso_des_311: string;

  @Column({ type: 'date', nullable: true })
  fecha_alta_311: Date;

  // ⬇️ Resto de campos como nullable
  @Column({ nullable: true })
  proveedor_311: string;

  @Column({ type: 'date', nullable: true })
  fecha_factura_311: Date;

  @Column({ nullable: true })
  num_factura_311: string;

  @Column({ nullable: true })
  observaciones_311: string;

  @Column({ nullable: true })
  estado_conservacion_311: string;

  @Column('decimal', { nullable: true })
  valor_311: number;

  @Column('int', { nullable: true })
  vida_util_311: number;

  @Column({ type: 'date', nullable: true })
  fecha_estado_311: Date;

  @Column({ nullable: true })
  descripcion_estado_311: string;

  @Column({ nullable: true })
  estado_311: string;

  @Column({ type: 'date', nullable: true })
  estado_faltante_311: Date;

  @Column({ nullable: true })
  id_func_311: number;

  @Column({ nullable: true })
  id_clasi_311: number;

  @Column({ nullable: true })
  id_ufv_311: number;

  @Column({ nullable: true })
  id_311_1: number;

  @Column({ nullable: true })
  d_legal_311_1: string;

  @Column({ nullable: true })
  clasificacion_311_1: string;

  @Column({ nullable: true })
  uso_311_1: string;

  @Column({ nullable: true })
  superficie_311_1: string;

  @Column({ nullable: true })
  servicio_311_1: string;

  @Column({ nullable: true })
  id_per: number;

  @Column({ nullable: true })
  tdi_per: string;

  @Column({ nullable: true })
  ndi_per: string;

  @Column({ nullable: true })
  expedido_per: string;

  @Column({ nullable: true })
  nombre_per: string;

  @Column({ nullable: true })
  ap_paterno_per: string;

  @Column({ nullable: true })
  ap_materno_per: string;

  @Column({ nullable: true })
  ap_conyuge_per: string;

  @Column({ nullable: true })
  sexo_per: string;

  @Column({ type: 'date', nullable: true })
  f_nacimiento_per: Date;

  @Column({ nullable: true })
  e_civil_per: string;

  @Column({ nullable: true })
  profesion_per: string;

  @Column({ nullable: true })
  direccion_per: string;

  @Column({ nullable: true })
  telefono_per: string;

  @Column({ nullable: true })
  celular_per: string;

  @Column({ nullable: true })
  email_per: string;

  @Column({ nullable: true })
  estado_per: string;

  @Column({ nullable: true })
  id_clasi: number;

  @Column({ nullable: true })
  codigo_clasi: string;

  @Column({ nullable: true })
  nombre_clasi: string;

  @Column({ nullable: true })
  descripcion_clasi: string;

  @Column({ nullable: true })
  id_sg_clasi: number;

  @Column({ nullable: true })
  id_func: number;

  @Column({ nullable: true })
  tipo_func: string;

  @Column({ nullable: true })
  num_file: string;

  @Column({ nullable: true })
  item_func: string;

  @Column({ nullable: true })
  telefono_func: string;

  @Column({ nullable: true })
  interno_func: string;

  @Column({ nullable: true })
  estado_func: string;

  @Column({ nullable: true })
  id_cargo_func: number;

  @Column({ nullable: true })
  id_ubi_func: number;

  @Column({ nullable: true })
  id_act_func: number;

  @Column({ nullable: true })
  id_cargo: number;

  @Column({ nullable: true })
  codigo_cargo: string;

  @Column({ nullable: true })
  nombre_cargo: string;

  @Column({ nullable: true })
  descripcion_cargo: string;

  @Column({ nullable: true })
  estado_cargo: string;

  @Column({ nullable: true })
  id_af_cargo: number;

  @Column({ nullable: true })
  id_ubi: number;

  @Column({ nullable: true })
  codigo_ubi: string;

  @Column({ nullable: true })
  nombre_ubi: string;

  @Column({ nullable: true })
  direccion_ubi: string;

  @Column({ nullable: true })
  distrito_ubi: string;

  @Column({ nullable: true })
  observaciones_ubi: string;

  @Column({ nullable: true })
  estado_ubi: string;

  @Column({ nullable: true })
  id_af: number;

  @Column({ nullable: true })
  codigo_af: string;

  @Column({ nullable: true })
  nombre_af: string;

  @Column({ nullable: true })
  estado_af: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @Column({ name: 'creado_por', nullable: true })
  creado_por: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'creado_por' })
  creadoPor: Usuario;

  @Column({ name: 'actualizado_por', nullable: true })
  actualizado_por: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'actualizado_por' })
  actualizadoPor: Usuario;

}
