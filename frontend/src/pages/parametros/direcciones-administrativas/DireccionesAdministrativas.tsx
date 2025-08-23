import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    rol: string;
    // otros campos si los necesitas
}

export interface DireccionAdministrativa {
    id: number;
    codigo: string;
    descripcion: string;
    creado_por: Usuario;
    actualizado_por?: Usuario; // ⬅️ puede ser null
    created_at: string;
    updated_at?: string; // ⬅️ puede ser null
}



const DireccionesAdministrativas = () => {
    const [direcciones, setDirecciones] = useState<DireccionAdministrativa[]>([]);
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerDirecciones();
    }, []);

    const obtenerDirecciones = async () => {
        try {
            const res = await axios.get<DireccionAdministrativa[]>('/parametros/direcciones-administrativas');
            console.log('Respuesta del backend:', res.data);
            setDirecciones(res.data);
        } catch (error) {
            console.error('Error al obtener direcciones administrativas:', error);
        } finally {
            setCargando(false); // ✅ Esto es lo que faltaba
        }
    };




    const eliminarDireccion = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta dirección administrativa?')) return;
        try {
            await axios.delete(`/parametros/direcciones-administrativas/${id}`);
            obtenerDirecciones();
        } catch (error) {
            console.error('Error al eliminar la dirección administrativa:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Direcciones Administrativas</h4>

            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate('/parametros/direcciones-administrativas/nueva')}
            >
                <i className="bi bi-plus-lg me-1"></i> Nueva Dirección
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Creado por</th>
                            <th>Fecha de Registro</th>
                            <th>Actualizado por</th>
                            <th>Fecha de Actualización</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={6} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : direcciones.length > 0 ? (
                            direcciones.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.descripcion}</td>
                                    <td>
                                        {item.creado_por
                                            ? `${item.creado_por.nombre} (${item.creado_por.rol})`
                                            : '—'}
                                    </td>

                                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        {item.actualizado_por
                                            ? `${item.actualizado_por.nombre} (${item.actualizado_por.rol})`
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.updated_at
                                            ? new Date(item.updated_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/direcciones-administrativas/editar/${item.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => eliminarDireccion(item.id)}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default DireccionesAdministrativas;
