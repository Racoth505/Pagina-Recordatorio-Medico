import React, { useState, useEffect } from 'react';
import './App.css';
import editarAzul from './assets/editar-azul.png';

function GestionConsultas() {
    const [consultas, setConsultas] = useState([]);
    // Estado para controlar la reprogramación
    const [consultaAReprogramar, setConsultaAReprogramar] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');

    useEffect(() => {
        cargarConsultas();
    }, []);

    const cargarConsultas = () => {
        const guardadas = JSON.parse(localStorage.getItem('consultas')) || [];
        setConsultas(guardadas);
    };

    const handleUpdateStatus = (id, newStatus) => {
        const actualizadas = consultas.map(c => 
            c.id === id ? { ...c, status: newStatus } : c
        );
        setConsultas(actualizadas);
        localStorage.setItem('consultas', JSON.stringify(actualizadas));
    };

    // Función para iniciar el proceso de reprogramación
    const iniciarReprogramacion = (consulta) => {
        setConsultaAReprogramar(consulta);
        // Establecer la fecha actual como valor por defecto
        setNuevaFecha(new Date().toISOString().split('T')[0]);
        setNuevaHora('09:00');
    };

    // Función para confirmar la reprogramación
    const confirmarReprogramacion = () => {
        if (!nuevaFecha || !nuevaHora) {
            alert('Por favor, selecciona fecha y hora para la reprogramación');
            return;
        }

        const consultasActualizadas = consultas.map(consulta => {
            if (consulta.id === consultaAReprogramar.id) {
                return { 
                    ...consulta, 
                    fecha: nuevaFecha,
                    hora: nuevaHora,
                    status: 'reprogramada',
                    // Guardar la fecha original para referencia
                    fechaOriginal: consulta.fecha 
                };
            }
            return consulta;
        });
        
        // Actualizar estado y localStorage
        setConsultas(consultasActualizadas);
        localStorage.setItem('consultas', JSON.stringify(consultasActualizadas));
        
        // Limpiar el estado de reprogramación
        setConsultaAReprogramar(null);
        setNuevaFecha('');
        setNuevaHora('');
        
        alert('Consulta reprogramada exitosamente');
    };

    // Función para cancelar la reprogramación
    const cancelarReprogramacion = () => {
        setConsultaAReprogramar(null);
        setNuevaFecha('');
        setNuevaHora('');
    };

    const getStatusClass = (status) => {
        if (status === 'aceptada') return 'status-aceptada';
        if (status === 'reprogramada') return 'status-reprogramada';
        return 'status-pendiente';
    };

    return (
        <div className="form-usuario-container">
            <h2 className="page-title">
                <img src={editarAzul} alt="Consultas" />
                Gestionar Consultas
            </h2>

            {/* Modal de Reprogramación */}
            {consultaAReprogramar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Reprogramar Consulta</h3>
                        <p><strong>Paciente:</strong> {consultaAReprogramar.paciente}</p>
                        <p><strong>Fecha original:</strong> {consultaAReprogramar.fecha}</p>
                        <p><strong>Motivo:</strong> {consultaAReprogramar.motivo}</p>
                        
                        <div className="form-group">
                            <label>Nueva Fecha:</label>
                            <input
                                type="date"
                                value={nuevaFecha}
                                onChange={(e) => setNuevaFecha(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Nueva Hora:</label>
                            <input
                                type="time"
                                value={nuevaHora}
                                onChange={(e) => setNuevaHora(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={confirmarReprogramacion}
                            >
                                Confirmar Reprogramación
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={cancelarReprogramacion}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="lista-items-container">
                
                {consultas.length === 0 && (
                    <p>No hay solicitudes de consulta pendientes.</p>
                )}

                {consultas.map(c => (
                    <div key={c.id} className="item-card">
                        <h4>Paciente: {c.paciente}</h4>
                        <p>Doctor: {c.doctor || 'Sin asignar'}</p>
                        <p>Fecha Solicitada: {c.fecha}</p>
                        {c.hora && <p>Hora: {c.hora}</p>}
                        <p>Motivo: {c.motivo}</p>
                        
                        <p>
                            Estado: <span className={`status-badge ${getStatusClass(c.status)}`}>
                                {c.status}
                            </span>
                        </p>

                        {c.status === 'pendiente' && (
                            <div className="item-card-actions">
                                <button 
                                    className="btn btn-success"
                                    onClick={() => handleUpdateStatus(c.id, 'aceptada')}
                                >
                                    Aceptar
                                </button>
                                <button 
                                    className="btn btn-warning"
                                    onClick={() => iniciarReprogramacion(c)}
                                >
                                    Reprogramar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GestionConsultas;