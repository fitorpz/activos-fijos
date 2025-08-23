import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UserLogModule } from '../user-log/user-log.module'; // 👈 importar el módulo

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    UserLogModule, // 👈 importar correctamente aquí
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
