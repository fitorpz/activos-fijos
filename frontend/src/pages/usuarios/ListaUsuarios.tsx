import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarUsuarios } from '../../api/usuarios';
import { Usuario } from '../../interfaces/usuario'; // Importa desde archivo central

export const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token no encontrado');

                const res = await listarUsuarios(token);

                // Manejo de posibles roles como string
                const usuariosNormalizados: Usuario[] = res.data.map((u: any) => ({
                    ...u,
                    rol:
                        typeof u.rol === 'string'
                            ? { id: 0, nombre: u.rol }
                            : u.rol || null,
                }));

                setUsuarios(usuariosNormalizados);
            } catch (error) {
                alert('Error al cargar usuarios');
            }
        };

        cargarUsuarios();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Usuarios Registrados</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Creado Por</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.nombre || '—'}</td>
                                <td>
                                    {typeof usuario.rol === 'object' && usuario.rol !== null
                                        ? usuario.rol.nombre
                                        : 'Sin rol'}
                                </td>

                                <td>
                                    {usuario.creadoPor?.nombre
                                        ? `${usuario.creadoPor.nombre} (${usuario.creadoPor.correo})`
                                        : '—'}
                                </td>
                                <td>
                                    {usuario.creadoEn
                                        ? new Date(usuario.creadoEn).toLocaleDateString()
                                        : '—'}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() =>
                                            navigate(`/usuarios/editar/${usuario.id}`)
                                        }
                                    >
                                        Editar
                                    </button>
                                    {/* Agrega aquí botón de eliminar o restaurar si lo deseas */}
                                </td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-muted">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
