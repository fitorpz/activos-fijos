import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegistroUsuario = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('superadministrador');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ⚠️ Previene que se recargue la página

        console.log('📤 Enviando datos de usuario...');

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token no encontrado. Por favor inicia sesión nuevamente.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    correo,
                    contrasena,
                    rol,
                    nombre,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Error al registrar usuario');
            }

            const data = await res.json();
            console.log('✅ Usuario creado:', data);

            alert('Usuario registrado con éxito');
            navigate('/usuarios');
        } catch (err: any) {
            console.error('❌ Error:', err);
            alert('Error al registrar usuario: ' + (err.message || 'Error desconocido'));
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h4 className="mb-4 text-center">Registrar Usuario</h4>

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
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
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
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-select"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            required
                        >
                            <option value="superadministrador">Superadministrador</option>
                            <option value="admin_usuarios">Administrador de Usuarios</option>
                            <option value="administrador">Administrador</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="tecnico">Técnico</option>
                            <option value="visitante">Visitante</option>
                        </select>

                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
