// src/pages/ListaUsuarios.tsx

import React, { useEffect, useState } from 'react';
import { listarUsuarios } from '../api/usuarios';

// Definir el tipo de Usuario
interface Usuario {
    id: number;
    correo: string;
    rol: string;
}

export const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        listarUsuarios().then((res) => {
            setUsuarios(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Usuarios Registrados</h2>
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario.id}>
                        {usuario.correo} - Rol: {usuario.rol}
                    </li>
                ))}
            </ul>
        </div>
    );
};
