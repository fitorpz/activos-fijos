import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    rol: string;
}

export interface DireccionAdministrativa {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: {
        id: number;
        nombre: string;
        correo: string;
        rol: string;
    };
    created_at: string;
    actualizado_por?: {
        id: number;
        nombre: string;
        correo: string;
        rol: string;
    } | null;
    updated_at?: string;

}

const DireccionesAdministrativas = () => {
    const [direcciones, setDirecciones] = useState<DireccionAdministrativa[]>([]);
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');

    const [filtroCodigo, setFiltroCodigo] = useState('');
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [filtroCreadoPor, setFiltroCreadoPor] = useState('');
    const [filtroActualizadoPor, setFiltroActualizadoPor] = useState('');
    const [direccionesFiltradas, setDireccionesFiltradas] = useState<DireccionAdministrativa[]>([]);


    useEffect(() => {
        obtenerDirecciones();
    }, [estadoFiltro]);

    useEffect(() => {
        aplicarFiltros();
    }, [filtroCodigo, filtroDescripcion, filtroCreadoPor, filtroActualizadoPor, direcciones, estadoFiltro]);

    const obtenerDirecciones = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get<DireccionAdministrativa[]>(
                `/parametros/direcciones-administrativas`,
                {
                    params: estadoFiltro
                        ? {
                            estado:
                                estadoFiltro === 'activos'
                                    ? 'ACTIVO'
                                    : estadoFiltro === 'inactivos'
                                        ? 'INACTIVO'
                                        : 'todos',
                        }
                        : {},
                }
            );

            const ordenado = res.data.sort((a, b) => a.codigo.localeCompare(b.codigo));

            setDirecciones(ordenado);
            setCargando(false);
        } catch (error) {
            console.error('Error al obtener direcciones:', error);
        } finally {
            setCargando(false);
        }
    };

    const aplicarFiltros = () => {
        let filtrado = direcciones;

        if (estadoFiltro === 'activos') {
            filtrado = filtrado.filter(dir => dir.estado === 'ACTIVO');
        } else if (estadoFiltro === 'inactivos') {
            filtrado = filtrado.filter(dir => dir.estado === 'INACTIVO');
        }
        // Filtrar por código (insensible a mayúsculas)
        if (filtroCodigo.trim() !== '') {
            filtrado = filtrado.filter(dir =>
                dir.codigo.toLowerCase().includes(filtroCodigo.trim().toLowerCase())
            );
        }

        // Filtrar por descripción
        if (filtroDescripcion.trim() !== '') {
            filtrado = filtrado.filter(dir =>
                dir.descripcion.toLowerCase().includes(filtroDescripcion.trim().toLowerCase())
            );
        }

        // Filtrar por creado por (nombre o rol)
        if (filtroCreadoPor.trim() !== '') {
            filtrado = filtrado.filter(dir =>
                dir.creado_por.nombre.toLowerCase().includes(filtroCreadoPor.trim().toLowerCase()) ||
                dir.creado_por.rol.toLowerCase().includes(filtroCreadoPor.trim().toLowerCase())
            );
        }

        // Filtrar por actualizado por (nombre o rol)
        if (filtroActualizadoPor.trim() !== '') {
            filtrado = filtrado.filter(dir =>
                dir.actualizado_por &&
                (dir.actualizado_por.nombre.toLowerCase().includes(filtroActualizadoPor.trim().toLowerCase()) ||
                    dir.actualizado_por.rol.toLowerCase().includes(filtroActualizadoPor.trim().toLowerCase()))
            );
        }

        setDireccionesFiltradas(filtrado);
    };
    const eliminarDireccion = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta dirección administrativa?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/parametros/direcciones-administrativas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            obtenerDirecciones();
        } catch (error) {
            console.error('Error al eliminar la dirección administrativa:', error);
        }
    };
    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de esta dirección?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/parametros/direcciones-administrativas/${id}/cambiar-estado`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            obtenerDirecciones();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    };

    const exportarPDF = async () => {
        const token = localStorage.getItem('token');

        const estadoSeleccionado =
            estadoFiltro === 'activos'
                ? 'ACTIVO'
                : estadoFiltro === 'inactivos'
                    ? 'INACTIVO'
                    : 'todos';

        try {
            const response = await axios.get(
                `/parametros/direcciones-administrativas/exportar/pdf?estado=${estadoSeleccionado}`,
                {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const blob = new Blob([response.data as Blob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar PDF:', error);
            alert('Ocurrió un error al exportar el PDF.');
        }
    };



    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Direcciones Administrativas</h4>
                    <p className="text-muted small">Gestión de registros por Dirección Administrativa</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/direcciones-administrativas/nueva')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nueva Dirección
                    </button>

                    <button className="btn btn-outline-success" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/parametros')}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Volver a Parámetros
                    </button>

                    <div style={{ minWidth: '160px' }}>
                        <select
                            id="filtro-estado"
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="form-select"
                        >
                            <option value="todos">Todos</option>
                            <option value="activos">Solo Activos</option>
                            <option value="inactivos">Solo Inactivos</option>
                        </select>
                    </div>
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
                        <tr>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar código"
                                    value={filtroCodigo}
                                    onChange={(e) => setFiltroCodigo(e.target.value)}
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar descripción"
                                    value={filtroDescripcion}
                                    onChange={(e) => setFiltroDescripcion(e.target.value)}
                                />
                            </th>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar creado por"
                                    value={filtroCreadoPor}
                                    onChange={(e) => setFiltroCreadoPor(e.target.value)}
                                />
                            </th>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Filtrar actualizado por"
                                    value={filtroActualizadoPor}
                                    onChange={(e) => setFiltroActualizadoPor(e.target.value)}
                                />
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={8} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : direccionesFiltradas.length > 0 ? (
                            direccionesFiltradas.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.estado}</td>
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
                                            className={`btn btn-sm ${item.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            title={item.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                                            onClick={() => cambiarEstado(item.id)}
                                        >
                                            <i className="bi bi-arrow-repeat"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DireccionesAdministrativas;
