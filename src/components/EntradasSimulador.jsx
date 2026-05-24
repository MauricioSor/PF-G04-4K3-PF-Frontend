import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// --- SUB-COMPONENTES PARA MANTENER EL CÓDIGO LIMPIO ---

// 1. Tarjeta Panel (cada una de las 4 columnas)
const ConfigPanel = ({ title, icon, children }) => (
    <div className="p-4 d-flex flex-column h-100" style={{ 
        backgroundColor: '#111827', 
        borderRadius: '16px', 
        border: '1px solid rgba(255,255,255,0.05)',
    }}>
        <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="me-2" style={{ fontSize: '1.1rem' }}>{icon}</span>
            <h5 className="m-0 text-white fw-bold fs-6">{title}</h5>
        </div>
        <div className="d-flex flex-column flex-grow-1">
            {children}
        </div>
    </div>
);

// 2. Input/Select personalizado
const CustomInput = ({ label, name, type = "number", value, onChange, subtitle, as = "input", options = [] }) => (
    <Form.Group className="mb-4">
        <Form.Label className="text-light mb-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>{label}</Form.Label>
        {as === 'select' ? (
            <Form.Select 
                name={name}
                value={value} 
                onChange={onChange}
                className="custom-select shadow-none text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Form.Select>
        ) : (
            <Form.Control 
                type={type} 
                name={name}
                value={value} 
                onChange={onChange}
                className="custom-input shadow-none text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            />
        )}
        {subtitle && <div className="text-secondary mt-1" style={{ fontSize: '0.75rem' }}>{subtitle}</div>}
    </Form.Group>
);


// --- COMPONENTE PRINCIPAL ---
const ConfiguracionSimulacion = () => {
    // ESTADO: Aquí guardamos todos los valores listos para enviar al Backend
    const [config, setConfig] = useState({
        duracion: 8,
        semilla: 2000,
        procesadores: 2,
        llegadas_tipo: 'Normal',
        llegadas_media: 15,
        llegadas_desviacion: 4.1,
        recepcion_tipo: 'Exponencial',
        recepcion_media: 10,
        procesamiento_tipo: 'Uniforme',
        procesamiento_min: 15,
        procesamiento_max: 45
    });

    // Función que actualiza el estado cuando el usuario escribe o selecciona algo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función a llamar cuando hacen click en "Ejecutar"
    const handleEjecutar = () => {
        console.log("Datos listos para enviar al Backend:", config);
        // Aquí harías tu petición Axios o Fetch, por ejemplo:
        // axios.post('/api/simular', config).then(res => ...)
    };

    // Función para resetear los valores por defecto
    const handleReiniciar = () => {
        setConfig({
            duracion: 8, semilla: 2000, procesadores: 2,
            llegadas_tipo: 'Normal', llegadas_media: 15, llegadas_desviacion: 4.1,
            recepcion_tipo: 'Exponencial', recepcion_media: 10,
            procesamiento_tipo: 'Uniforme', procesamiento_min: 15, procesamiento_max: 45
        });
    };

    return (
        <Container className="py-5" style={{ fontFamily: 'system-ui, sans-serif' }}>
            
            {/* Estilos inyectados para arreglar el hover/focus nativo de Bootstrap en modo oscuro */}
            <style>
                {`
                    .custom-input:focus, .custom-select:focus {
                        background-color: #0f172a !important;
                        border-color: #10b981 !important;
                        color: white !important;
                        box-shadow: 0 0 0 0.15rem rgba(16, 185, 129, 0.25) !important;
                    }
                    .custom-select {
                        /* Flecha blanca para el select */
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                    }
                `}
            </style>

            {/* Título de la sección */}
            <div className="d-flex align-items-center mb-4">
                <div 
                    className="d-flex justify-content-center align-items-center rounded me-3" 
                    style={{ width: '35px', height: '35px', backgroundColor: '#064e3b' }}
                >
                    <span style={{ fontSize: '1.2rem', color: '#34d399' }}>⚡</span>
                </div>
                <h3 className="m-0 text-white fw-bold">Configuración de la Simulación</h3>
            </div>

            {/* Grid de 4 Columnas */}
            <Row className="g-4">
                <Col lg={3} md={6}>
                    <ConfigPanel title="General" icon="⚙️">
                        <CustomInput name="duracion" label="Duración (horas)" value={config.duracion} onChange={handleChange} subtitle="Tiempo total de simulación" />
                        <CustomInput name="semilla" label="Semilla (RNG)" value={config.semilla} onChange={handleChange} subtitle="Para reproducibilidad de resultados" />
                        <CustomInput name="procesadores" label="Cant. Procesadores" value={config.procesadores} onChange={handleChange} subtitle="Servidores de diagnóstico/desarme" />
                    </ConfigPanel>
                </Col>
                
                <Col lg={3} md={6}>
                    <ConfigPanel title="Distribución de Llegadas" icon="📥">
                        <CustomInput as="select" options={['Normal', 'Exponencial', 'Poisson', 'Uniforme']} name="llegadas_tipo" label="Tipo de distribución" value={config.llegadas_tipo} onChange={handleChange} />
                        <CustomInput name="llegadas_media" label="Media (min)" value={config.llegadas_media} onChange={handleChange} subtitle="μ — Valor esperado" />
                        <CustomInput name="llegadas_desviacion" label="Desviación estándar (min)" value={config.llegadas_desviacion} onChange={handleChange} subtitle="σ — Dispersión" />
                    </ConfigPanel>
                </Col>
                
                <Col lg={3} md={6}>
                    <ConfigPanel title="Distribución de Recepción" icon="📋">
                        <CustomInput as="select" options={['Exponencial', 'Normal', 'Uniforme']} name="recepcion_tipo" label="Tipo de distribución" value={config.recepcion_tipo} onChange={handleChange} />
                        <CustomInput name="recepcion_media" label="Tiempo medio de servicio (min)" value={config.recepcion_media} onChange={handleChange} subtitle="μ = 1/media" />
                    </ConfigPanel>
                </Col>
                
                <Col lg={3} md={6}>
                    <ConfigPanel title="Distribución de Procesamiento" icon="⚙️">
                        <CustomInput as="select" options={['Uniforme', 'Erlang', 'Exponencial', 'Normal']} name="procesamiento_tipo" label="Tipo de distribución" value={config.procesamiento_tipo} onChange={handleChange} />
                        <CustomInput name="procesamiento_min" label="Mínimo (min)" value={config.procesamiento_min} onChange={handleChange} subtitle="Límite inferior" />
                        <CustomInput name="procesamiento_max" label="Máximo (min)" value={config.procesamiento_max} onChange={handleChange} subtitle="Límite superior" />
                    </ConfigPanel>
                </Col>
            </Row>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-center mt-5 gap-3">
                <Button 
                    className="border-0 px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ 
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={handleEjecutar}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{ fontSize: '1.2rem' }}>▶</span> Ejecutar Simulación
                </Button>
                
                <Button 
                    variant="dark"
                    className="px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                    style={{ 
                        backgroundColor: '#1e293b', 
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={handleReiniciar}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                    <span style={{ fontSize: '1.2rem' }}>↺</span> Reiniciar
                </Button>
            </div>

        </Container>
    );
};

export default ConfiguracionSimulacion;