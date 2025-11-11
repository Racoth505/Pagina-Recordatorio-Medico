import React, { useState, useEffect } from 'react';

const Perfil = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
    });
    const [doctorData, setDoctorData] = useState({
        nombre: '',
        apellidos: '',
        sexo: '',
        numeroConsultorio: '',
        direccionConsultorio: '',
        especialidad: 'Médico'
    });
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    useEffect(() => {
        // Obtener datos del doctor desde localStorage
        const nombreCompleto = localStorage.getItem('nombre') || '';
        const sexo = localStorage.getItem('sexo') || 'Masculino';
        const numeroConsultorio = localStorage.getItem('numeroConsultorio') || 'No especificado';
        const direccionConsultorio = localStorage.getItem('direccionConsultorio') || 'No especificada';
        const especialidad = localStorage.getItem('especialidad') || 'Médico';
        
        // Separar nombre y apellidos si están en el mismo campo
        const nombresArray = nombreCompleto.split(' ');
        const nombre = nombresArray[0] || '';
        const apellidos = nombresArray.slice(1).join(' ') || '';

        setDoctorData({
            nombre: nombre || 'Doctor',
            apellidos: apellidos || '',
            sexo: sexo,
            numeroConsultorio: numeroConsultorio,
            direccionConsultorio: direccionConsultorio,
            especialidad: especialidad
        });
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
        // Limpiar mensajes anteriores
        setMensaje('');
        setTipoMensaje('');

        // Validar campos vacíos
        if (!passwordData.contrasenaActual || !passwordData.nuevaContrasena || !passwordData.confirmarContrasena) {
            setMensaje('Por favor, completa todos los campos');
            setTipoMensaje('error');
            return;
        }

        // Obtener información del usuario actual
        const userEmail = localStorage.getItem('correo');
        const userName = localStorage.getItem('nombre');
        const userId = localStorage.getItem('userId');

        // Buscar usuario en localStorage
        const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuariosData = JSON.parse(localStorage.getItem('usuariosData')) || [];
        
        // Usar storedUsers o usuariosData
        let usersToCheck = [...storedUsers];
        if (usersToCheck.length === 0 && usuariosData.length > 0) {
            usersToCheck = [...usuariosData];
        }

        // Buscar usuario por diferentes criterios
        const currentUser = usersToCheck.find(user => {
            return (
                (user.id && user.id.toString() === userId?.toString()) ||
                (user.correo && user.correo === userEmail) ||
                (user.nombreCompleto && user.nombreCompleto === userName) ||
                (user.nombre && user.nombre === userName) ||
                (user.email && user.email === userEmail)
            );
        });

        if (!currentUser) {
            setMensaje('No se pudo encontrar el usuario. Contacte al administrador.');
            setTipoMensaje('error');
            return;
        }

        // Verificar contraseña actual
        const contraseñaGuardada = currentUser.contraseña || currentUser.password || currentUser.contrasena;
        
        if (contraseñaGuardada !== passwordData.contrasenaActual) {
            setMensaje('La contraseña actual es incorrecta');
            setTipoMensaje('error');
            return;
        }

        // Validaciones de nueva contraseña
        if (passwordData.contrasenaActual === passwordData.nuevaContrasena) {
            setMensaje('La nueva contraseña no puede ser igual a la actual');
            setTipoMensaje('error');
            return;
        }

        if (passwordData.nuevaContrasena.length < 6) {
            setMensaje('La contraseña debe tener al menos 6 caracteres');
            setTipoMensaje('error');
            return;
        }

        if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
            setMensaje('Las nuevas contraseñas no coinciden');
            setTipoMensaje('error');
            return;
        }

        // Actualizar contraseña
        const userIndex = usersToCheck.findIndex(user => {
            return (
                (user.id && user.id.toString() === userId?.toString()) ||
                (user.correo && user.correo === userEmail) ||
                (user.nombreCompleto && user.nombreCompleto === userName) ||
                (user.nombre && user.nombre === userName) ||
                (user.email && user.email === userEmail)
            );
        });

        if (userIndex !== -1) {
            // Actualizar contraseña
            usersToCheck[userIndex].contraseña = passwordData.nuevaContrasena;
            
            // Guardar en localStorage
            if (storedUsers.length > 0) {
                localStorage.setItem('usuarios', JSON.stringify(usersToCheck));
            } else {
                localStorage.setItem('usuariosData', JSON.stringify(usersToCheck));
            }

            // También actualizar en el otro almacenamiento si existe
            if (usuariosData.length > 0 && storedUsers.length > 0) {
                const dataIndex = usuariosData.findIndex(user => {
                    return (
                        (user.id && user.id.toString() === userId?.toString()) ||
                        (user.correo && user.correo === userEmail) ||
                        (user.nombreCompleto && user.nombreCompleto === userName)
                    );
                });
                if (dataIndex !== -1) {
                    usuariosData[dataIndex].contraseña = passwordData.nuevaContrasena;
                    localStorage.setItem('usuariosData', JSON.stringify(usuariosData));
                }
            }

            setMensaje('¡Contraseña cambiada exitosamente!');
            setTipoMensaje('success');
            
            // Limpiar campos después de 2 segundos y cerrar modal
            setTimeout(() => {
                setPasswordData({
                    contrasenaActual: '',
                    nuevaContrasena: '',
                    confirmarContrasena: ''
                });
                setShowPasswordModal(false);
                setMensaje('');
                setTipoMensaje('');
            }, 2000);

        } else {
            setMensaje('Error al actualizar la contraseña');
            setTipoMensaje('error');
        }
    };

    const closeModal = () => {
        setShowPasswordModal(false);
        setPasswordData({
            contrasenaActual: '',
            nuevaContrasena: '',
            confirmarContrasena: ''
        });
        setMensaje('');
        setTipoMensaje('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* TÍTULO PRINCIPAL */}
            <h1 style={{ 
                marginBottom: '30px', 
                color: '#2c3e50',
                fontSize: '32px',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Perfil
            </h1>

            {/* Información del Doctor */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e1e8ed'
            }}>
                <h2 style={{ 
                    color: '#3498db',
                    marginBottom: '25px',
                    fontSize: '24px',
                    fontWeight: '600',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '10px'
                }}>
                    Doctor
                </h2>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Profesión:</strong>
                        <span style={{ color: '#555' }}>{doctorData.especialidad}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Nombre(s):</strong>
                        <span style={{ color: '#555' }}>{doctorData.nombre}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Apellidos:</strong>
                        <span style={{ color: '#555' }}>{doctorData.apellidos || 'No especificado'}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Número del Consultorio:</strong>
                        <span style={{ color: '#555' }}>{doctorData.numeroConsultorio}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Dirección del Consultorio:</strong>
                        <span style={{ color: '#555' }}>{doctorData.direccionConsultorio}</span>
                    </div>
                </div>
            </div>

            {/* Sección de Cambio de Contraseña */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e1e8ed'
            }}>
                <h2 style={{ 
                    color: '#3498db',
                    marginBottom: '25px',
                    fontSize: '24px',
                    fontWeight: '600',
                    borderBottom: '2px solid #3498db',
                    paddingBottom: '10px'
                }}>
                    CAMBIAR CONTRASEÑA
                </h2>

                <form onSubmit={handlePasswordSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 'bold', 
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            Contraseña actual
                        </label>
                        <input
                            type="password"
                            name="contrasenaActual"
                            value={passwordData.contrasenaActual}
                            onChange={handlePasswordChange}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #e0e0e0', 
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s'
                            }}
                            placeholder="Ingresa tu contraseña actual"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 'bold', 
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            name="nuevaContrasena"
                            value={passwordData.nuevaContrasena}
                            onChange={handlePasswordChange}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #e0e0e0', 
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s'
                            }}
                            placeholder="Ingresa nueva contraseña"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: 'bold', 
                            color: '#2c3e50',
                            fontSize: '16px'
                        }}>
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            name="confirmarContrasena"
                            value={passwordData.confirmarContrasena}
                            onChange={handlePasswordChange}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #e0e0e0', 
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s'
                            }}
                            placeholder="Confirma la contraseña"
                            required
                        />
                    </div>

                    {mensaje && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            backgroundColor: tipoMensaje === 'error' ? '#f8d7da' : '#d4edda',
                            color: tipoMensaje === 'error' ? '#721c24' : '#155724',
                            border: `1px solid ${tipoMensaje === 'error' ? '#f5c6cb' : '#c3e6cb'}`
                        }}>
                            {mensaje}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '14px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                flex: 1,
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                        >
                            Cambiar contraseña
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setPasswordData({
                                    contrasenaActual: '',
                                    nuevaContrasena: '',
                                    confirmarContrasena: ''
                                });
                                setMensaje('');
                                setTipoMensaje('');
                            }}
                            style={{ 
                                backgroundColor: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                padding: '14px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                flex: 1,
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Perfil;
