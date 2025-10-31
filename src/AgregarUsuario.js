import React, { useState } from 'react';
import './App.css';
import agregarAzul from './assets/agregar-azul.png';
import defaultAvatar from './assets/default-profile-image.png';

function AgregarUsuario() {
    const [rol, setRol] = useState('');
    const [mostrarCampos, setMostrarCampos] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const valor = e.target.value.trim().toLowerCase();
            if (valor === 'doctor' || valor === 'administrador') {
                setRol(valor);
                setMostrarCampos(true);
            } else {
                alert('Por favor escribe "Doctor" o "Administrador".');
                setMostrarCampos(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado (simulación)');
    };

    return (
        <div className="form-usuario-container">
            <h2 className="page-title">
                <img src={agregarAzul} alt="Agregar" />
                Agregar Usuario
            </h2>

            <form className="user-form-card" onSubmit={handleSubmit}>
                
                {/* --- Avatar --- */}
                <div className="avatar-section">
                    <img src={defaultAvatar} alt="Avatar" className="avatar-img" />
                    <button type="button" className="edit-avatar-btn"></button>
                </div>

                {/* --- Tarjeta para seleccionar rol --- */}
                <div className="rol-card">
                    <label htmlFor="rol" className="rol-label">
                        ¿Qué es? <span className="hint">(Presiona Enter para confirmar)</span>
                    </label>
                    <input
                        type="text"
                        id="rol"
                        name="rol"
                        className="rol-input"
                        placeholder="Doctor o Administrador y presiona Enter"
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* --- Campos para DOCTOR --- */}
                {mostrarCampos && rol === 'doctor' && (
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="nombre">Nombre completo</label>
                            <input type="text" id="nombre" name="nombre" placeholder="Ej. Nicolás Álvarez" />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="correo">Correo</label>
                            <input type="email" id="correo" name="correo" placeholder="correo@ejemplo.com" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cedula">Cédula profesional</label>
                            <input type="text" id="cedula" name="cedula" placeholder="1234567" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="especialidad">Especialidad</label>
                            <input type="text" id="especialidad" name="especialidad" placeholder="Cardiología, Pediatría..." />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono de consultorio</label>
                            <input type="tel" id="telefono" name="telefono" placeholder="+52 000 111 2222" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="direccion">Dirección de consultorio</label>
                            <input type="text" id="direccion" name="direccion" placeholder="Calle, número, colonia..." />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input type="password" id="contraseña" name="contraseña" placeholder="********" />
                        </div>
                    </div>
                )}

                {/* --- Campos para ADMINISTRADOR --- */}
                {mostrarCampos && rol === 'administrador' && (
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="correo">Correo</label>
                            <input type="email" id="correo" name="correo" placeholder="correo@ejemplo.com" />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="nombre">Nombre completo</label>
                            <input type="text" id="nombre" name="nombre" placeholder="Ej. Mariana López" />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input type="password" id="contraseña" name="contraseña" placeholder="********" />
                        </div>
                    </div>
                )}

                {/* --- Botón Guardar --- */}
                {mostrarCampos && (
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AgregarUsuario;
