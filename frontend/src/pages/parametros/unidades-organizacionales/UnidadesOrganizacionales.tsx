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
}

export interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    area: Area;
    creado_por: Usuario;
    actualizado_por?: Usuario | null;
    created_at: string;
    updated_at?: string | null;
}

const UnidadesOrganizacionales = () => {
    const [unidades, setUnidades] = useState<UnidadOrganizacional[]>([]);
    const [cargando, setCargando] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const [filtros, setFiltros] = useState({
        codigo: '',
        descripcion: '',
        estado: '',
        area: '',
        creado_por: '',
        actualizado_por: '',
    });
    const manejarCambioFiltro = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const navigate = useNavigate();

    useEffect(() => {
        obtenerUnidades();
    }, [estadoFiltro]);

    const obtenerUnidades = async () => {
        setCargando(true);
        try {
            const res = await axios.get<UnidadOrganizacional[]>(
                '/parametros/unidades-organizacionales',
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
            setUnidades(res.data);
        } catch (error) {
            console.error('Error al obtener unidades organizacionales:', error);
        } finally {
            setCargando(false);
        }
    };

    const eliminarUnidad = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta unidad organizacional?')) return;
        try {
            await axios.delete(`/parametros/unidades-organizacionales/${id}`);
            obtenerUnidades();
        } catch (error) {
            console.error('Error al eliminar la unidad organizacional:', error);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de esta unidad organizacional?')) return;
        try {
            await axios.put(`/parametros/unidades-organizacionales/${id}/cambiar-estado`);
            obtenerUnidades();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    };

    const exportarPDF = async () => {
        const estadoSeleccionado =
            estadoFiltro === 'activos'
                ? 'ACTIVO'
                : estadoFiltro === 'inactivos'
                    ? 'INACTIVO'
                    : 'todos';

        try {
            const response = await axios.get(
                `/parametros/unidades-organizacionales/exportar/pdf?estado=${estadoSeleccionado}`,
                {
                    responseType: 'blob'
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

    const unidadesFiltradas = [...unidades]
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .filter((unidad) => {
            const filtroCodigo = unidad.codigo.toLowerCase().includes(filtros.codigo.toLowerCase());
            const filtroDescripcion = unidad.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase());
            const filtroEstado = filtros.estado
                ? unidad.estado.toLowerCase() === filtros.estado.toLowerCase()
                : true;
            const filtroArea = unidad.area?.codigo.toLowerCase().includes(filtros.area.toLowerCase());
            const filtroCreadoPor = filtros.creado_por
                ? unidad.creado_por?.nombre.toLowerCase().includes(filtros.creado_por.toLowerCase()) ?? false
                : true;
            const filtroActualizadoPor = filtros.actualizado_por
                ? unidad.actualizado_por?.nombre.toLowerCase().includes(filtros.actualizado_por.toLowerCase()) ?? false
                : true;

            return (
                filtroCodigo &&
                filtroDescripcion &&
                filtroEstado &&
                filtroArea &&
                filtroCreadoPor &&
                filtroActualizadoPor
            );
        });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Unidades Organizacionales</h4>
                    <p className="text-muted small">Gestión de registros por Unidad Organizacional</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/unidades-organizacionales/registrar')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nueva Unidad
                    </button>

                    <button
                        className="btn btn-outline-success"
                        onClick={exportarPDF}
                    >
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
                            <th>Área</th>
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
                                    name="codigo"
                                    value={filtros.codigo}
                                    onChange={manejarCambioFiltro}
                                    className="form-control form-control-sm"
                                    placeholder="Buscar código"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={filtros.descripcion}
                                    onChange={manejarCambioFiltro}
                                    className="form-control form-control-sm"
                                    placeholder="Buscar descripción"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="area"
                                    value={filtros.area}
                                    onChange={manejarCambioFiltro}
                                    className="form-control form-control-sm"
                                    placeholder="Buscar área"
                                />
                            </th>
                            <th>
                                <select
                                    name="estado"
                                    value={filtros.estado}
                                    onChange={manejarCambioFiltro}
                                    className="form-select form-select-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="creado_por"
                                    value={filtros.creado_por}
                                    onChange={manejarCambioFiltro}
                                    className="form-control form-control-sm"
                                    placeholder="Buscar creador"
                                />
                            </th>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    name="actualizado_por"
                                    value={filtros.actualizado_por}
                                    onChange={manejarCambioFiltro}
                                    className="form-control form-control-sm"
                                    placeholder="Buscar actualizador"
                                />
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={10} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : unidadesFiltradas.length > 0 ? (
                            unidadesFiltradas.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.area?.codigo || '—'}</td>
                                    <td>{item.estado}</td>
                                    <td>
                                        {item.creado_por
                                            ? `${item.creado_por.nombre}${item.creado_por.rol ? ` (${item.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.actualizado_por
                                            ? `${item.actualizado_por.nombre}${item.actualizado_por.rol ? ` (${item.actualizado_por.rol})` : ''}`
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
                                            onClick={() => navigate(`/parametros/unidades-organizacionales/editar/${item.id}`)}
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
                                <td colSpan={10} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UnidadesOrganizacionales;
