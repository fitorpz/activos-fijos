import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface Area {
    id: number;
    codigo: string;
    descripcion: string;
    estado: string;
    creado_por: Usuario;
    created_at: string;
    actualizado_por?: Usuario | null;
    updated_at?: string | null;
}

const Areas = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [cargando, setCargando] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos'); // ✅ Filtro de estado
    const navigate = useNavigate();

    useEffect(() => {
        obtenerAreas(estadoFiltro);
    }, [estadoFiltro]);

    const obtenerAreas = async (estado: string = '') => {
        setCargando(true);
        try {
            const res = await axios.get<Area[]>(`/parametros/areas`, {
                params: estado
                    ? { estado: estado === 'activos' ? 'ACTIVO' : estado === 'inactivos' ? 'INACTIVO' : 'todos' }
                    : {},
            });
            setAreas(res.data);
        } catch (error) {
            console.error('Error al obtener áreas:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number, estadoActual: string) => {
        const nuevoEstado = estadoActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

        if (!window.confirm(`¿Deseas cambiar el estado a ${nuevoEstado}?`)) return;

        try {
            await axios.put(`/parametros/areas/${id}/cambiar-estado`);
            obtenerAreas(estadoFiltro);
        } catch (error) {
            console.error('Error al cambiar el estado del área:', error);
        }
    };


    const handleFiltro = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoFiltro(event.target.value);
    };

    const exportarPDF = async () => {
        const token = localStorage.getItem('token');
        const estadoSeleccionado =
            estadoFiltro === 'activos'
                ? 'ACTIVO'
                : estadoFiltro === 'inactivos'
                    ? 'INACTIVO'
                    : 'todos';


        const response = await axios.get(
            `/parametros/areas/exportar/pdf?estado=${estadoSeleccionado}`,

            {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            }
        );


        const url = window.URL.createObjectURL(new Blob([response.data as Blob], { type: 'application/pdf' }));
        window.open(url, '_blank');
    };


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Áreas</h4>
                    <p className="text-muted small">Gestión de registros por área</p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/areas/registrar')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nueva Área
                    </button>

                    <button className="btn btn-outline-success ms-2" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <select
                        id="filtro-estado"
                        value={estadoFiltro}
                        onChange={handleFiltro}
                        className="form-select"
                    >
                        <option value="todos">Todos</option>
                        <option value="activos">Solo Activos</option>
                        <option value="inactivos">Solo Inactivos</option>
                        
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Estado</th>
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
                        ) : areas.length > 0 ? (
                            areas.map((area, index) => (
                                <tr key={area.id}>
                                    <td>{index + 1}</td>
                                    <td>{area.codigo}</td>
                                    <td>{area.descripcion}</td>
                                    <td>{area.estado}</td>
                                    <td>
                                        {area.creado_por
                                            ? `${area.creado_por.nombre}${area.creado_por.rol ? ` (${area.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{new Date(area.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>
                                        {area.actualizado_por
                                            ? `${area.actualizado_por.nombre}${area.actualizado_por.rol ? ` (${area.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{area.updated_at ? new Date(area.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/areas/editar/${area.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${area.estado === 'ACTIVO' ? 'btn-danger' : 'btn-success'}`}
                                            onClick={() => cambiarEstado(area.id, area.estado)}
                                        >
                                            {area.estado === 'ACTIVO' ? (
                                                <i className="bi bi-x-circle"></i>
                                            ) : (
                                                <i className="bi bi-check-circle"></i>
                                            )}
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

export default Areas;
