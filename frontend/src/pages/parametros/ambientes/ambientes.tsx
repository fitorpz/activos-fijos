import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
}

export interface Ambiente {
    id: number;
    codigo: string;
    descripcion: string;
    unidad_organizacional: UnidadOrganizacional;
    creado_por: Usuario;
    actualizado_por?: Usuario | null;
    created_at: string;
    updated_at?: string | null;
}

const Ambientes = () => {
    const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerAmbientes();
    }, []);

    const obtenerAmbientes = async () => {
        try {
            const res = await axios.get<Ambiente[]>('/parametros/ambientes');
            setAmbientes(res.data);
        } catch (error) {
            console.error('Error al obtener ambientes:', error);
        } finally {
            setCargando(false);
        }
    };

    const eliminarAmbiente = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este ambiente?')) return;
        try {
            await axios.delete(`/parametros/ambientes/${id}`);
            obtenerAmbientes();
        } catch (error) {
            console.error('Error al eliminar el ambiente:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Ambientes</h4>

            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate('/parametros/ambientes/registrar')}
            >
                <i className="bi bi-plus-lg me-1"></i> Nuevo Ambiente
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Unidad Organizacional</th>
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
                                <td colSpan={9} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : ambientes.length > 0 ? (
                            ambientes.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.unidad_organizacional?.descripcion || '—'}</td>
                                    <td>
                                        {item.creado_por
                                            ? `${item.creado_por.nombre}${item.creado_por.rol ? ` (${item.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        {item.actualizado_por
                                            ? `${item.actualizado_por.nombre}${item.actualizado_por.rol ? ` (${item.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{item.updated_at ? new Date(item.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/ambientes/editar/${item.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => eliminarAmbiente(item.id)}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ambientes;
