import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface GrupoContable {
    id: number;
    codigo: string;
    descripcion: string;
}

const RegistroAuxiliar = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        codigo_grupo: '',
        estado: 'ACTIVO',
    });

    const [cargando, setCargando] = useState(false);
    const [gruposContables, setGruposContables] = useState<GrupoContable[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        cargarGruposContables();
    }, []);

    const cargarGruposContables = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get<GrupoContable[]>('/parametros/grupos-contables', {
                headers: { Authorization: `Bearer ${token}` },
                params: { estado: 'ACTIVO' }, // Solo activos
            });
            setGruposContables(res.data);
        } catch (error) {
            console.error('❌ Error al cargar grupos contables:', error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);

        try {
            const payload = {
                codigo: formData.codigo.trim(),
                descripcion: formData.descripcion.trim(),
                codigo_grupo: formData.codigo_grupo.trim(),
                estado: formData.estado,
            };

            const token = localStorage.getItem('token');
            await axios.post('/parametros/auxiliares', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('✅ Auxiliar registrado con éxito.');
            navigate('/parametros/auxiliares');
        } catch (error: any) {
            console.error('❌ Error al registrar auxiliar:', error);
            alert(error?.response?.data?.message || '❌ Error al registrar el auxiliar.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="form-container">
                <h4 className="mb-4">Nuevo Auxiliar</h4>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="codigo_grupo" className="form-label">Grupo Contable</label>
                        <select
                            id="codigo_grupo"
                            name="codigo_grupo"
                            className="form-select"
                            value={formData.codigo_grupo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Selecciona un grupo contable --</option>
                            {gruposContables.map((grupo) => (
                                <option key={grupo.id} value={grupo.codigo}>
                                    {grupo.codigo} - {grupo.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="estado" className="form-label">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            className="form-select"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Registrar'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/parametros/auxiliares')}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistroAuxiliar;
