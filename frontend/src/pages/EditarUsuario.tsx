// src/pages/EditarUsuario.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('usuario');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Error al obtener datos del usuario');

                const data = await res.json();
                setCorreo(data.correo);
                setNombre(data.nombre || '');
                setRol(data.rol);
                setCargando(false);
            } catch (err) {
                alert('Error al cargar usuario');
                navigate('/usuarios');
            }
        };

        obtenerUsuario();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ correo, nombre, rol }),
            });

            if (!res.ok) throw new Error('Error al actualizar usuario');

            alert('Usuario actualizado con éxito');
            navigate('/usuarios');
        } catch (error: any) {
            alert(error.message || 'Error al actualizar');
        }
    };

    if (cargando) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h4 className="mb-4 text-center">Editar Usuario</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-select"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                        >
                            <option value="superadministrador">Superadministrador</option>
                            <option value="usuario">Usuario</option>
                        </select>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
