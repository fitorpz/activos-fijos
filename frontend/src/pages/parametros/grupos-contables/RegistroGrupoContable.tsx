import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

const RegistroGrupoContable = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        tiempo: '',
        porcentaje: '',
        estado: 'ACTIVO',
    });

    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

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
                tiempo: Number(formData.tiempo),
                porcentaje: Number(formData.porcentaje),
                estado: formData.estado,
            };

            const token = localStorage.getItem('token');
            await axios.post('/parametros/grupos-contables', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('✅ Grupo Contable registrado con éxito.');
            navigate('/parametros/grupos-contables');
        } catch (error: any) {
            console.error('❌ Error al registrar grupo contable:', error);
            alert(error?.response?.data?.message || '❌ Error al registrar el grupo contable.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="form-container">
                <h4 className="mb-4">Nuevo Grupo Contable</h4>
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
                        <label htmlFor="tiempo" className="form-label">Tiempo</label>
                        <input
                            type="number"
                            id="tiempo"
                            name="tiempo"
                            className="form-control"
                            value={formData.tiempo}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="porcentaje" className="form-label">Porcentaje</label>
                        <input
                            type="number"
                            id="porcentaje"
                            name="porcentaje"
                            className="form-control"
                            value={formData.porcentaje}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            step="0.01"
                        />
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
                        onClick={() => navigate('/parametros/grupos-contables')}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistroGrupoContable;
