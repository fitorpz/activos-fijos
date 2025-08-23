import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <>
            {/* Menú superior */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <a className="navbar-brand fw-bold text-warning" href="/dashboard">
                    Sistema de Activos Fijos
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/parametros">
                                <i className="bi bi-gear-fill"></i> Parámetros
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/dashboard">
                                <i className="bi bi-box-seam"></i> Activos Fijos
                            </a>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="clasificadorDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-journals"></i> Clasificador
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="clasificadorDropdown">
                                <li><a className="dropdown-item" href="#"><i className="bi bi-building me-2"></i> Edificios</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-lamp me-2"></i> Oficina y Muebles</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-gear-wide-connected me-2"></i> Producción</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-truck me-2"></i> Transporte, Tracción y Elevación</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-heart-pulse me-2"></i> Médico y Laboratorio</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-wifi me-2"></i> Comunicación</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-joystick me-2"></i> Educacional y Recreativo</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-tools me-2"></i> Otra Maquinaria y Equipo</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-map me-2"></i> Tierras y Terrenos</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-box-fill me-2"></i> Fungibles</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-shield-lock me-2"></i> Otros Activos de Control</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-tools me-2"></i> Accesorios / Repuestos de Equipo</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-car-front-fill me-2"></i> Repuestos de Vehículos</a></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="contableDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-folder2-open"></i> Contable
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="contableDropdown">
                                <li><a className="dropdown-item" href="#"><i className="bi bi-building me-2"></i> Edificios</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-lamp me-2"></i> Oficina y Muebles</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-gear-wide-connected me-2"></i> Producción</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-truck me-2"></i> Transporte</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-heart-pulse me-2"></i> Médico y Laboratorio</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-wifi me-2"></i> Comunicación</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-joystick me-2"></i> Educacional y Recreativo</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-tools me-2"></i> Otra Maquinaria</a></li>
                                <li><a className="dropdown-item" href="#"><i className="bi bi-map me-2"></i> Tierras y Terrenos</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item fw-bold text-warning" href="#">
                                        <i className="bi bi-graph-up-arrow me-2"></i> Balance Activos Fijos
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/panel-control">
                                <i className="bi bi-grid"></i> Panel de Control
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/usuarios">
                                <i className="bi bi-people-fill"></i> Gestión de Usuarios
                            </a>
                        </li>

                    </ul>

                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </button>
                </div>
            </nav>

            {/* Contenido de cada página */}
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
