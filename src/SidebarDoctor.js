import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './App.css'; 

import logo from './assets/image.png'; 
import usuariosAzul from './assets/usuarios-azul.png';
import usuariosNegro from './assets/usuarios-negro.png';
import agregarAzul from './assets/agregar-azul.png';
import agregarNegro from './assets/agregar-negro.png';
import editarAzul from './assets/editar-azul.png';
import editarNegro from './assets/editar-negro.png';
import salirImg from './assets/salir.png';
import flechaImg from './assets/flecha-para-cerrar-barra.png';

function SidebarDoctor({ isCollapsed, toggleSidebar }) { 
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login'); 
    };

    const handleNavigationClick = (path) => {
        navigate(path);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            
            {/* --- LOGO --- */}
            <div className="logo-section">
                <span className="logo-text">[ LOGO ]</span>
            </div>

            {/* --- NAVEGACIÓN --- */}
            <nav className="nav-menu">
                
                {/* 1. Ver pacientes */}
                <NavLink 
                    to="/doctor/ver-pacientes" 
                    className="nav-item"
                    onClick={() => handleNavigationClick("/doctor/ver-pacientes")}
                >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? usuariosAzul : usuariosNegro} alt="Ver pacientes" />
                            <span className="nav-text">Ver pacientes</span>
                        </>
                    )}
                </NavLink>

                {/* 2. Agregar receta */}
                <NavLink 
                    to="/doctor/agregar-receta" 
                    className="nav-item"
                    onClick={() => handleNavigationClick("/doctor/agregar-receta")}
                >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? agregarAzul : agregarNegro} alt="Agregar receta" />
                            <span className="nav-text">Agregar receta</span>
                        </>
                    )}
                </NavLink>

                {/* 3. Agregar pacientes */}
                <NavLink 
                    to="/doctor/agregar-pacientes" 
                    className="nav-item"
                    onClick={() => handleNavigationClick("/doctor/agregar-pacientes")}
                >
                    {({ isActive }) => (
                        <>
                            <img src={isActive ? editarAzul : editarNegro} alt="Agregar pacientes" />
                            <span className="nav-text">Agregar pacientes</span>
                        </>
                    )}
                </NavLink>
            </nav>

            {/* --- SALIR Y TOGGLE --- */}
            <div className="sidebar-footer">
                <div className="nav-item logout-btn" onClick={handleLogout}>
                    <img src={salirImg} alt="Salir" />
                    <span className="nav-text">Salir</span>
                </div>

                <div className="toggle-btn" onClick={toggleSidebar}>
                    <img 
                        src={flechaImg} 
                        alt="Toggle" 
                        className={isCollapsed ? 'flipped' : ''} 
                    />
                </div>
            </div>
        </div>
    );
}

export default SidebarDoctor;
