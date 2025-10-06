import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/colors.css';
import '../styles/layout.css';
import { useState } from 'react';
import logo from '../assets/img/escudo.png'


const Layout = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <div className="vscode-layout">
            {/* === Sidebar === */}
            <aside
                className={`vscode-sidebar ${expanded ? 'expanded' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                onMouseEnter={() => window.innerWidth > 768 && setExpanded(true)}
                onMouseLeave={() => window.innerWidth > 768 && setExpanded(false)}
            >
                <div className="sidebar-top">
                    <div
                        className="d-flex justify-content-center align-items-center mb-4"
                        style={{ width: '100%' }}
                    >
                        <img
                            src={logo}
                            alt="Logo GAMS"
                            style={{
                                maxWidth: '50%',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </div>

                <ul className="sidebar-menu">

                    <li>
                        <a href="/parametros">
                            <i className="bi bi-gear-fill"></i>
                            <span>Parámetros</span>
                        </a>
                    </li>
                    <li>
                        <a href="/dashboard">
                            <i className="bi bi-speedometer2"></i>
                            <span>Activos Fijos</span>
                        </a>
                    </li>
                    <li>
                        <a href="/tickets/imprimir">
                            <i className="bi bi-printer-fill"></i>
                            <span>Tickets</span>
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="usuariosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-people-fill"></i>
                            <span>Usuarios</span>
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="usuariosDropdown">
                            <li>
                                <a className="dropdown-item" href="/usuarios">
                                    <i className="bi bi-person-lines-fill me-2"></i>
                                    Gestión de Usuarios
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/usuarios/roles">
                                    <i className="bi bi-shield-lock-fill me-2"></i>
                                    Roles
                                </a>
                            </li>
                        </ul>
                    </li>


                </ul>

                <div className="sidebar-bottom">
                    <button onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* === Overlay en móvil === */}
            {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)}></div>}

            {/* === Contenido === */}
            <main className="vscode-content">
                <header className="vscode-topbar">
                    <button
                        className="toggle-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                    <h5 className="mb-0">Sistema de Activos Fijos</h5>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
