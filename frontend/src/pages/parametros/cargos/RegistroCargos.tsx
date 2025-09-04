import React, { useEffect, useState } from 'react';
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
}

interface Ambiente {
    id: number;
    codigo: string;
    descripcion: string;
}

const RegistroCargos = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        estado: 'ACTIVO',
        area_id: '',
        unidad_organizacional_id: '',
        ambiente_id: '',
    });

    const [areas, setAreas] = useState<Area[]>([]);
    const [unidades, setUnidades] = useState<UnidadOrganizacional[]>([]);
    const [mensajeCodigo, setMensajeCodigo] = useState<string | null>(null);

    const [ambienteInput, setAmbienteInput] = useState('');
    const [sugerenciasAmbientes, setSugerenciasAmbientes] = useState<Ambiente[]>([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    let debounceTimeout: any;

    const navigate = useNavigate();

    useEffect(() => {
        cargarAreas();
    }, []);

    const authHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const cargarAreas = async () => {
        try {
            const res = await axios.get<Area[]>('/parametros/areas?estado=ACTIVO', {
                headers: authHeaders(),
            });
            setAreas(res.data);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    };

    const cargarUnidades = async (areaId: string) => {
        try {
            const res = await axios.get<UnidadOrganizacional[]>(
                `/parametros/unidades-organizacionales?estado=ACTIVO&area_id=${areaId}`,
                { headers: authHeaders() }
            );
            setUnidades(res.data);
        } catch (error) {
            console.error('Error al cargar unidades organizacionales:', error);
        }
    };

    const buscarAmbientes = async (texto: string) => {
        if (!formData.unidad_organizacional_id || texto.trim().length === 0) {
            setSugerenciasAmbientes([]);
            return;
        }

        try {
            const res = await axios.get<Ambiente[]>(
                `/parametros/ambientes/buscar?unidad_organizacional_id=${formData.unidad_organizacional_id}&search=${texto}`,
                { headers: authHeaders() }
            );
            setSugerenciasAmbientes(res.data);
        } catch (error) {
            console.error('Error al buscar ambientes:', error);
            setSugerenciasAmbientes([]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'area_id') {
            setFormData(prev => ({
                ...prev,
                area_id: value,
                unidad_organizacional_id: '',
                ambiente_id: '',
                codigo: '',
            }));
            setUnidades([]);
            setAmbienteInput('');
            setSugerenciasAmbientes([]);
            cargarUnidades(value);
            return;
        }

        if (name === 'unidad_organizacional_id') {
            setFormData(prev => ({
                ...prev,
                unidad_organizacional_id: value,
                ambiente_id: '',
                codigo: '',
            }));
            setAmbienteInput('');
            setSugerenciasAmbientes([]);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.area_id || !formData.unidad_organizacional_id || !formData.ambiente_id) {
            alert('Por favor selecciona Área, Unidad y Ambiente.');
            return;
        }

        try {
            await axios.post(
                '/parametros/cargos',
                {
                    codigo: formData.codigo,
                    descripcion: formData.descripcion,
                    estado: formData.estado,
                    area_id: Number(formData.area_id),
                    unidad_organizacional_id: Number(formData.unidad_organizacional_id),
                    ambiente_id: Number(formData.ambiente_id),
                },
                { headers: authHeaders() }
            );

            alert('✅ Cargo registrado correctamente');
            navigate('/parametros/cargos');
        } catch (error) {
            console.error('❌ Error al registrar cargo:', error);
            alert('Ocurrió un error al registrar el cargo.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Registrar Cargo</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {/* Área */}
                        <div className="mb-3">
                            <label className="form-label">Área</label>
                            <select
                                className="form-select"
                                name="area_id"
                                value={formData.area_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Selecciona un área --</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {area.codigo} - {area.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Unidad */}
                        <div className="mb-3">
                            <label className="form-label">Unidad Organizacional</label>
                            <select
                                className="form-select"
                                name="unidad_organizacional_id"
                                value={formData.unidad_organizacional_id}
                                onChange={handleChange}
                                disabled={!formData.area_id}
                                required
                            >
                                <option value="">-- Selecciona una unidad --</option>
                                {unidades.map(unidad => (
                                    <option key={unidad.id} value={unidad.id}>
                                        {unidad.codigo} - {unidad.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ambiente - Autocomplete */}
                        <div className="mb-3 position-relative">
                            <label className="form-label">Ambiente</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar ambiente..."
                                value={ambienteInput}
                                disabled={!formData.unidad_organizacional_id}
                                onChange={(e) => {
                                    const texto = e.target.value;
                                    setAmbienteInput(texto);
                                    setMostrarSugerencias(true);
                                    clearTimeout(debounceTimeout);
                                    debounceTimeout = setTimeout(() => buscarAmbientes(texto), 300);
                                }}
                                required
                            />
                            {mostrarSugerencias && sugerenciasAmbientes.length > 0 && (
                                <ul className="list-group position-absolute w-100 z-3">
                                    {sugerenciasAmbientes.map((ambiente) => (
                                        <li
                                            key={ambiente.id}
                                            className="list-group-item list-group-item-action"
                                            onClick={async () => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ambiente_id: ambiente.id.toString(),
                                                }));
                                                setAmbienteInput(`${ambiente.codigo} - ${ambiente.descripcion}`);
                                                setMostrarSugerencias(false);

                                                try {
                                                    const res = await axios.get<{ codigo: string }>(
                                                        `/parametros/cargos/siguiente-codigo?ambiente_codigo=${ambiente.codigo}`,
                                                        { headers: authHeaders() }
                                                    );
                                                    setFormData(prev => ({ ...prev, codigo: res.data.codigo }));
                                                } catch (error) {
                                                    console.error('Error generando código:', error);
                                                    setMensajeCodigo('No se pudo generar el código automáticamente.');
                                                }
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {ambiente.codigo} - {ambiente.descripcion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Código */}
                        <div className="mb-3">
                            <label className="form-label">Código</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.codigo}
                                disabled
                            />
                            {mensajeCodigo && <div className="text-danger mt-1">{mensajeCodigo}</div>}
                        </div>

                        {/* Descripción */}
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Estado */}
                        <div className="mb-3">
                            <label className="form-label">Estado</label>
                            <select
                                className="form-select"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-save me-2"></i> Guardar
                            </button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/parametros/cargos')}>
                                Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroCargos;
