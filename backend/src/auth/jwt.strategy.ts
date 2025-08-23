import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret, // asegúrate que esto coincida con el .sign()
        });
    }

    async validate(payload: any) {
        console.log('✅ payload recibido:', payload); // <-- IMPORTANTE PARA DEPURAR

        return {
            id: payload.sub,
            correo: payload.correo,
            rol: payload.rol,
        };
    }
}
