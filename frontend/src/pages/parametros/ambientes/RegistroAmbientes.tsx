import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Area {
    id: number;
    codigo: string;
    descripcion: string;
}

interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
    area_id: number;
}

const RegistroAmbientes = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        area_id: '',
        unidad_organizacional_id: '',
    });

    const [areas, setAreas] = useState<Area[]>([]);
    const [unidades, setUnidades] = useState<UnidadOrganizacional[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarAreas();
    }, []);

    useEffect(() => {
        if (formData.area_id) {
            cargarUnidadesPorArea(parseInt(formData.area_id));
        } else {
            setUnidades([]);
            setFormData(prev => ({ ...prev, unidad_organizacional_id: '' }));
        }
    }, [formData.area_id]);

    const cargarAreas = async () => {
        try {
            const res = await axios.get<Area[]>('/parametros/areas', {
                params: { estado: 'ACTIVO' },
            });
            setAreas(res.data);
        } catch (error) {
            console.error('❌ Error al cargar áreas:', error);
        }
    };

    const cargarUnidadesPorArea = async (areaId: number) => {
        try {
            const res = await axios.get<UnidadOrganizacional[]>('/parametros/unidades-organizacionales', {
                params: { estado: 'ACTIVO', area_id: areaId },
            });
            setUnidades(res.data);
        } catch (error) {
            console.error('❌ Error al cargar unidades organizacionales:', error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'area_id' && { unidad_organizacional_id: '' }) // resetear unidad si cambia el área
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { codigo, descripcion, area_id, unidad_organizacional_id } = formData;

        if (!codigo || !descripcion || !area_id || !unidad_organizacional_id) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setCargando(true);
        try {
            const payload = {
                codigo: codigo.trim(),
                descripcion: descripcion.trim(),
                unidad_organizacional_id: parseInt(unidad_organizacional_id),
            };

            await axios.post('/parametros/ambientes', payload);
            alert('✅ Ambiente registrado con éxito.');
            navigate('/parametros/ambientes');
        } catch (error: any) {
            console.error('❌ Error al registrar ambiente:', error);
            setError(error?.response?.data?.message || 'Error inesperado al registrar.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Registrar Ambiente</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {/* Código */}
                <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        className="form-control"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        className="form-control"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Área */}
                <div className="mb-3">
                    <label htmlFor="area_id" className="form-label">Área</label>
                    <select
                        id="area_id"
                        name="area_id"
                        className="form-select"
                        value={formData.area_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.codigo} - {area.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Unidad Organizacional */}
                <div className="mb-3">
                    <label htmlFor="unidad_organizacional_id" className="form-label">Unidad Organizacional</label>
                    <select
                        id="unidad_organizacional_id"
                        name="unidad_organizacional_id"
                        className="form-select"
                        value={formData.unidad_organizacional_id}
                        onChange={handleChange}
                        required
                        disabled={!formData.area_id}
                    >
                        <option value="">Seleccione una unidad organizacional</option>
                        {unidades.map(unidad => (
                            <option key={unidad.id} value={unidad.id}>
                                {unidad.codigo} - {unidad.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary" disabled={cargando}>
                        {cargando ? 'Guardando...' : (
                            <>
                                <i className="bi bi-save me-2"></i>Guardar
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/parametros/ambientes')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistroAmbientes;
