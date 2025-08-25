import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
}

const RegistroAmbientes = () => {
    const [formData, setFormData] = useState({
        descripcion: '',
        unidad_organizacional_id: '',
    });

    const [unidades, setUnidades] = useState<UnidadOrganizacional[]>([]);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarUnidades();
    }, []);

    const cargarUnidades = async () => {
        try {
            const res = await axios.get<UnidadOrganizacional[]>('/parametros/unidades-organizacionales');
            setUnidades(res.data);
        } catch (error) {
            console.error('Error al cargar unidades organizacionales:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        try {
            const payload = {
                descripcion: formData.descripcion.trim(),
                unidad_organizacional_id: parseInt(formData.unidad_organizacional_id),
            };

            await axios.post('/parametros/ambientes', payload);
            alert('✅ Ambiente registrado con éxito.');
            navigate('/parametros/ambientes');
        } catch (error: any) {
            console.error('Error al registrar ambiente:', error);
            alert(error?.response?.data?.message || '❌ Error al registrar el ambiente.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="form-container">
                <h4 className="mb-4">Nuevo Ambiente</h4>
                <form onSubmit={handleSubmit}>
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

                    <div className="mb-3">
                        <label htmlFor="unidad_organizacional_id" className="form-label">Unidad Organizacional</label>
                        <select
                            id="unidad_organizacional_id"
                            name="unidad_organizacional_id"
                            className="form-select"
                            value={formData.unidad_organizacional_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una unidad</option>
                            {unidades.map(unidad => (
                                <option key={unidad.id} value={unidad.id}>
                                    {unidad.codigo} - {unidad.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Registrar'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/parametros/ambientes')}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistroAmbientes;
