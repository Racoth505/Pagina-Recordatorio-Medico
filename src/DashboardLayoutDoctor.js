import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SidebarDoctor'; // Importamos el Sidebar
import './App.css'; // Usa el CSS global

// Renombrado para reflejar el contexto del doctor
function DoctorDashboardLayout() {
    // Estado para colapsar la barra lateral (manteniendo la funcionalidad existente)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    
    // **NUEVO ESTADO:** Guarda el título actual de la vista (ej: "Ver pacientes")
    const [currentTitle, setCurrentTitle] = useState("Ver pacientes");

    // Función para cambiar el estado de colapsado
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // La función que recibe el Sidebar para actualizar el título
    const handleNavigation = (newTitle) => {
        setCurrentTitle(newTitle);
    };

    return (
        <div className="dashboard-container">
            {/* El Sidebar ahora recibe la función handleNavigation 
                para actualizar el título principal.
            */}
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar}
                onNavigate={handleNavigation} // <-- Propiedad clave para actualizar el título
            />
            
            <main className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                
                {/* 1. Cabecera (Header) - Editada para mostrar el título dinámico y el doctor */}
                <header className="main-header">
                    <div className="header-title-section">
                        {/* Título de la vista (el texto azul que cambia) */}
                        <h2 className="view-title">{currentTitle}</h2>
                        {/* Línea divisora */}
                        <div className="title-separator"></div> 
                    </div>

                    {/* Información del Doctor (César Médico) */}
                    <div className="doctor-info">
                        <span className="doctor-name">César</span>
                        <span className="doctor-title">Médico</span>
                    </div>
                </header>

                {/* 2. Contenido de la Página */}
                <div className="page-content">
                    {/* Aquí se renderizan las rutas hijas (Usuarios, Agregar, etc.) */}
                    <Outlet />
                </div>

            </main>
        </div>
    );
}

export default DoctorDashboardLayout;