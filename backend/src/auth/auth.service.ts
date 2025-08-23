import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService,
    ) { }

    async validarUsuario(correo: string, contrasena: string): Promise<Usuario> {
        console.log('📥 Credenciales recibidas:', { correo, contrasena });

        const usuario = await this.usuarioRepository.findOne({ where: { correo } });

        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!isMatch) {
            console.log('❌ Contraseña incorrecta');
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        console.log('✅ Usuario autenticado');
        return usuario;
    }

    async login(usuario: Usuario): Promise<{ access_token: string }> {
        const payload = {
            sub: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol,
        };

        const token = this.jwtService.sign(payload);
        console.log('🔐 Token generado:', token);

        return { access_token: token };
    }
}
