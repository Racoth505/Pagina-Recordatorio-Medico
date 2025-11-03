import React, { useState, useEffect } from 'react';
import './App.css'; 

// Props: isOpen, onClose (para cerrar), onSave (para guardar/actualizar), medicamentoInicial (para editar)
function AgregarMedicamento({ isOpen, onClose, onSave, medicamentoInicial }) {
    
    // Estados internos del formulario
    const [nombre, setNombre] = useState('');
    const [dosis, setDosis] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [duracion, setDuracion] = useState('');
    const [instrucciones, setInstrucciones] = useState('');

    // Variable para saber si estamos editando
    const isEditing = medicamentoInicial !== null;

    // useEffect para llenar el formulario si estamos en modo "Editar"
    useEffect(() => {
        if (isEditing) {
            setNombre(medicamentoInicial.nombre || '');
            setDosis(medicamentoInicial.dosis || '');
            setFrecuencia(medicamentoInicial.frecuencia || '');
            setDuracion(medicamentoInicial.duracion || '');
            setInstrucciones(medicamentoInicial.instrucciones || '');
        } else {
            // Si abrimos en modo "Agregar", limpiamos los campos
            setNombre('');
            setDosis('');
            setFrecuencia('');
            setDuracion('');
            setInstrucciones('');
        }
    }, [medicamentoInicial, isOpen]); // Se ejecuta cuando 'medicamentoInicial' o 'isOpen' cambian

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!nombre || !dosis || !frecuencia || !duracion) {
            alert('Por favor, complete al menos Nombre, Dosis, Frecuencia y Duración.');
            return;
        }

        const medicamentoGuardado = {
            nombre,
            dosis,
            frecuencia,
            duracion,
            instrucciones
        };
        
        // Llamamos a la función onSave que nos pasó el padre (AgregarReceta)
        onSave(medicamentoGuardado); 
    };
    
    // e.stopPropagation() evita que el clic en el modal cierre el modal
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                <div className="modal-header">
                    {/* Título dinámico */}
                    <h3>{isEditing ? 'EDITAR MEDICAMENTO' : 'AGREGAR MEDICAMENTO'}</h3>
                </div>
                
                <form className="modal-body" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nombre del Medicamento</label>
                        <input 
                            type="text" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Amoxicilina 500mg"
                            required
                        />
                    </div>

                    <div className="form-grid"> {/* Reusa .form-grid */}
                        <div className="form-group">
                            <label>Dosis</label>
                            <input 
                                type="text" 
                                value={dosis}
                                onChange={(e) => setDosis(e.target.value)}
                                placeholder="1 cápsula"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Frecuencia</label>
                            <input 
                                type="text" 
                                value={frecuencia}
                                onChange={(e) => setFrecuencia(e.target.value)}
                                placeholder="Cada 8 horas"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Duración del Tratamiento</label>
                        <input 
                            type="text" 
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            placeholder="7 dias"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Instrucciones Especiales (Opcional)</label>
                        <textarea 
                            value={instrucciones}
                            onChange={(e) => setInstrucciones(e.target.value)}
                            rows="4"
                            placeholder="Ej. Tomar con alimentos"
                        ></textarea>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">
                            {/* Texto del botón dinámico */}
                            {isEditing ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AgregarMedicamento;
