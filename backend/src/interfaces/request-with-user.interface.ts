// src/interfaces/request-with-user.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    correo: string;
    // puedes agregar más campos si tu token los incluye
  };
}
