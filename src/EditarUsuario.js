import React, { useState } from 'react';
import './App.css';
import editarAzul from './assets/editar-azul.png';
import defaultAvatar from './assets/default-profile-image.png';

// --- Simulación de datos desde "Backend" ---
const fakeApiData = {
    '1': {
        rol: 'Doctor',
        nombre: 'Nicolas Alvarez',
        correo: 'nicolas@hospital.com',
        cedula: 'A1234567',
        especialidad: 'Cardiología',
        telefono: '+52 111 222 3333',
        direccion: 'Av. Salud #123',
        contraseña: '******',
        avatar: defaultAvatar,
    },
    '2': {
        rol: 'Administrador',
        nombre: 'Mariana López',
        correo: 'mariana@admin.com',
        contraseña: '******',
        avatar: defaultAvatar,
    },
    '3': {
        rol: 'Paciente',
        nombre: 'Ana Gómez',
        sexo: 'Femenino',
        telefono: '+52 555 888 9999',
        direccion: 'Calle Paz 456',
        nacimiento: '1998-02-15',
        padecimiento: 'Hipertensión',
        avatar: defaultAvatar,
    },
};

function EditarUsuario() {
    const [claveUnica, setClaveUnica] = useState('');
    const [usuarioData, setUsuarioData] = useState(null);
    const [editableFields, setEditableFields] = useState({});

    // --- Buscar usuario al presionar Enter ---
    const handleClaveCheck = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const data = fakeApiData[claveUnica.trim()];
            if (data) {
                setUsuarioData(data);
                setEditableFields({ ...data });
            } else {
                alert('Usuario no encontrado (usa 1, 2 o 3)');
                setUsuarioData(null);
            }
        }
    };

    const handleChange = (e) => {
        setEditableFields({
            ...editableFields,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos actualizados:', editableFields);
        alert('Usuario actualizado');
    };

    const handleEliminar = () => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            console.log('Usuario eliminado:', claveUnica);
            handleRecargar(); // limpia todo al eliminar
        }
    };

    // Limpia el formulario como si recargaras la página
    const handleRecargar = () => {
        setUsuarioData(null);
        setEditableFields({});
        setClaveUnica('');
    };

    // --- Campos según el rol ---
    const renderCamposPorRol = () => {
        if (!usuarioData) return null;

        const rol = usuarioData.rol.toLowerCase();

        switch (rol) {
            case 'doctor':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Correo</label>
                            <input
                                type="email"
                                name="correo"
                                value={editableFields.correo || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Cédula Profesional</label>
                            <input
                                type="text"
                                name="cedula"
                                value={editableFields.cedula || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Especialidad</label>
                            <input
                                type="text"
                                name="especialidad"
                                value={editableFields.especialidad || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contraseña"
                                value={editableFields.contraseña || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono de consultorio</label>
                            <input
                                type="text"
                                name="telefono"
                                value={editableFields.telefono || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Dirección de consultorio</label>
                            <input
                                type="text"
                                name="direccion"
                                value={editableFields.direccion || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );

            case 'administrador':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Correo</label>
                            <input
                                type="email"
                                name="correo"
                                value={editableFields.correo || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contraseña"
                                value={editableFields.contraseña || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );

            case 'paciente':
                return (
                    <>
                        <div className="form-group">
                            <label>Sexo</label>
                            <input
                                type="text"
                                name="sexo"
                                value={editableFields.sexo || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={editableFields.telefono || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={editableFields.direccion || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="nacimiento"
                                value={editableFields.nacimiento || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Padecimiento</label>
                            <input
                                type="text"
                                name="padecimiento"
                                value={editableFields.padecimiento || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );

            default:
                return <p>Rol desconocido</p>;
        }
    };

    return (
        <div className="form-usuario-container">
            <h2 className="page-title">
                <img src={editarAzul} alt="Editar" />
                Editar Usuario
            </h2>

            <form className="user-form-card" onSubmit={handleSubmit}>
                {/* --- Avatar --- */}
                {usuarioData && (
                    <div className="avatar-section">
                        <img
                            src={usuarioData.avatar || defaultAvatar}
                            alt="Avatar"
                            className="avatar-img"
                        />
                        <button type="button" className="edit-avatar-btn"></button>
                    </div>
                )}

                {/* --- Campo de ID --- */}
                <div className="form-group full-width">
                    <label>ID (Presiona Enter para buscar)</label>
                    <input
                        type="text"
                        name="claveUnica"
                        value={claveUnica}
                        onChange={(e) => setClaveUnica(e.target.value)}
                        onKeyDown={handleClaveCheck}
                        disabled={!!usuarioData}
                        placeholder="Escribe 1, 2 o 3"
                    />
                </div>

                {/* --- Si hay usuario --- */}
                {usuarioData && (
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Rol</label>
                            <input type="text" value={usuarioData.rol} disabled />
                        </div>
                        <div className="form-group full-width">
                            <label>Nombre completo</label>
                            <input type="text" value={usuarioData.nombre} disabled />
                        </div>

                        {/* Campos dinámicos según el rol */}
                        {renderCamposPorRol()}
                    </div>
                )}

                {/* --- Botones --- */}
                {usuarioData && (
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleRecargar}
                        >
                            Limpiar / Nuevo ID
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleEliminar}
                        >
                            Eliminar Usuario
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default EditarUsuario;
