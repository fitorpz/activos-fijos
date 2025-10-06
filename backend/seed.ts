// backend/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsuariosService } from './src/usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { RolUsuario } from './src/usuarios/enums/rol-usuario.enum'; // ajusta la ruta si es distinta


async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usuarioService = app.get(UsuariosService);

    const correo = 'admin@ejemplo.com';
    const contrasena = await bcrypt.hash('password123', 10); // 👉 define la contraseña normal
    const hash = await bcrypt.hash(contrasena, 10); // 👉 genera el hash una sola vez
    const nombre = 'Administrador Inicial';
    const rol = RolUsuario.SUPERADMIN;

    const existe = await usuarioService.buscarPorCorreo(correo);
    if (existe) {
        console.log('❌ El usuario ya existe.');
        return;
    }

    await usuarioService.create(
        { correo, contrasena, nombre, rol_id: 1 },
        undefined,  // creadorId
        true        // yaHasheado = true
    );

    console.log('✅ Usuario creado exitosamente.');
    await app.close();
}

bootstrap();
