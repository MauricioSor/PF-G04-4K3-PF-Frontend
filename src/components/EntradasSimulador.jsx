import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { DEFAULTS } from '../engine/constants.js';

// --- SUB-COMPONENTES PARA MANTENER EL CÓDIGO LIMPIO ---

// 1. Tarjeta Panel (cada columna de configuración)
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

// 2. Input/Select personalizado. options puede ser string[] o {value,label}[].
const CustomInput = ({ label, name, type = "number", value, onChange, subtitle, as = "input", options = [], step, min, disabled = false }) => (
    <Form.Group className="mb-4">
        <Form.Label className="text-light mb-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>{label}</Form.Label>
        {as === 'select' ? (
            <Form.Select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="custom-select shadow-none text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            >
                {options.map(opt => {
                    const v = typeof opt === 'object' ? opt.value : opt;
                    const l = typeof opt === 'object' ? opt.label : opt;
                    return <option key={v} value={v}>{l}</option>;
                })}
            </Form.Select>
        ) : (
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                step={type === 'number' ? (step ?? 'any') : undefined}
                min={min}
                className="custom-input shadow-none text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}
            />
        )}
        {subtitle && <div className="text-secondary mt-1" style={{ fontSize: '0.75rem' }}>{subtitle}</div>}
    </Form.Group>
);

// --- CONFIG POR DEFECTO (deriva de DEFAULTS, en formato plano para el formulario) ---
const defaultConfig = {
    semilla: DEFAULTS.semilla,
    dias: DEFAULTS.dias,
    a: DEFAULTS.a,
    c: DEFAULTS.c,
    m: DEFAULTS.m,
    lambdaLotes: DEFAULTS.lambdaLotes,
    ceBase: DEFAULTS.ceBase,
    ceSpan: DEFAULTS.ceSpan,
    tipoCutoff1: DEFAULTS.tipoCutoffs[0],
    tipoCutoff2: DEFAULTS.tipoCutoffs[1],
    pesoBase: DEFAULTS.pesoBase,
    pesoSpan: DEFAULTS.pesoSpan,
    trMu: DEFAULTS.trMu,
    trSigma: DEFAULTS.trSigma,
    tdBase: DEFAULTS.tdBase,
    tdSpan: DEFAULTS.tdSpan,
    destinoCutoff1: DEFAULTS.destinoCutoffs[0],
    destinoCutoff2: DEFAULTS.destinoCutoffs[1],
    tddBase: DEFAULTS.tddBase,
    tddSpan: DEFAULTS.tddSpan,
    eficaciaCutoff: DEFAULTS.eficaciaCutoff,
    agua1: DEFAULTS.aguaPorTipo[1],
    agua2: DEFAULTS.aguaPorTipo[2],
    agua3: DEFAULTS.aguaPorTipo[3],
    umbralTT: DEFAULTS.umbralTT,
    umbralTTR: DEFAULTS.umbralTTR,
    umbralTEP: DEFAULTS.umbralTEP,
};

const toNum = (v) => Number(v);

// Convierte los valores del formulario (strings) a la config tipada del motor.
function normalizarConfig(c) {
    return {
        semilla: toNum(c.semilla),
        dias: toNum(c.dias),
        generador: 'mixto',
        a: toNum(c.a),
        c: toNum(c.c),
        m: toNum(c.m),
        modoLlegadas: 'poisson',
        lambdaLotes: toNum(c.lambdaLotes),
        minutosJornada: DEFAULTS.minutosJornada,
        ceBase: toNum(c.ceBase),
        ceSpan: toNum(c.ceSpan),
        tipoCutoffs: [toNum(c.tipoCutoff1), toNum(c.tipoCutoff2)],
        pesoBase: toNum(c.pesoBase),
        pesoSpan: toNum(c.pesoSpan),
        trMu: toNum(c.trMu),
        trSigma: toNum(c.trSigma),
        tdBase: toNum(c.tdBase),
        tdSpan: toNum(c.tdSpan),
        destinoCutoffs: [toNum(c.destinoCutoff1), toNum(c.destinoCutoff2)],
        tddBase: toNum(c.tddBase),
        tddSpan: toNum(c.tddSpan),
        eficaciaCutoff: toNum(c.eficaciaCutoff),
        aguaPorTipo: { 1: toNum(c.agua1), 2: toNum(c.agua2), 3: toNum(c.agua3) },
        umbralTT: toNum(c.umbralTT),
        umbralTTR: toNum(c.umbralTTR),
        umbralTEP: toNum(c.umbralTEP),
    };
}

// Validación liviana: devuelve un mensaje de error o null.
function validarConfig(cfg) {
    const requeridos = { semilla: cfg.semilla, dias: cfg.dias, 'λ lotes': cfg.lambdaLotes, a: cfg.a, m: cfg.m };
    for (const [k, v] of Object.entries(requeridos)) {
        if (!Number.isFinite(v)) return `El campo "${k}" debe ser un número válido.`;
    }
    if (cfg.dias < 1) return 'La cantidad de días debe ser al menos 1.';
    if (cfg.m <= 0) return 'El módulo m debe ser un entero positivo.';
    if (cfg.a <= 0) return 'La constante a debe ser positiva.';
    if (cfg.lambdaLotes <= 0) return 'λ (lotes por día) debe ser positivo.';

    const validarCortes = (arr, nombre) => {
        for (const x of arr) {
            if (!Number.isFinite(x) || x <= 0 || x > 1) return `Los cortes de ${nombre} deben estar en (0, 1].`;
        }
        for (let i = 1; i < arr.length; i += 1) {
            if (arr[i] <= arr[i - 1]) return `Los cortes de ${nombre} deben ser crecientes.`;
        }
        return null;
    };
    const e1 = validarCortes(cfg.tipoCutoffs, 'tipo');
    if (e1) return e1;
    const e2 = validarCortes(cfg.destinoCutoffs, 'destino');
    if (e2) return e2;
    if (!(cfg.eficaciaCutoff > 0 && cfg.eficaciaCutoff <= 1)) return 'El corte de eficacia debe estar en (0, 1].';
    return null;
}

// --- COMPONENTE PRINCIPAL ---
const ConfiguracionSimulacion = ({ onEjecutar, onReiniciar, estado = 'idle' }) => {
    const [config, setConfig] = useState({ ...defaultConfig });
    const [mostrarAvanzado, setMostrarAvanzado] = useState(false);
    const [errorValidacion, setErrorValidacion] = useState(null);

    const corriendo = estado === 'running';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleEjecutar = () => {
        const cfg = normalizarConfig(config);
        const err = validarConfig(cfg);
        if (err) { setErrorValidacion(err); return; }
        setErrorValidacion(null);
        onEjecutar?.(cfg);
    };

    const handleReiniciar = () => {
        setConfig({ ...defaultConfig });
        setErrorValidacion(null);
        onReiniciar?.();
    };

    return (
        <Container className="py-5" id="configuracion" style={{ fontFamily: 'system-ui, sans-serif' }}>

            {/* Estilos para el hover/focus en modo oscuro */}
            <style>
                {`
                    .custom-input:focus, .custom-select:focus {
                        background-color: #0f172a !important;
                        border-color: #10b981 !important;
                        color: white !important;
                        box-shadow: 0 0 0 0.15rem rgba(16, 185, 129, 0.25) !important;
                    }
                    .custom-input:disabled, .custom-select:disabled { opacity: 0.45; }
                    .custom-select {
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                    }
                `}
            </style>

            {/* Título de la sección */}
            <div className="d-flex align-items-center mb-4">
                <div className="d-flex justify-content-center align-items-center rounded me-3"
                    style={{ width: '35px', height: '35px', backgroundColor: '#064e3b' }}>
                    <span style={{ fontSize: '1.2rem', color: '#34d399' }}>⚡</span>
                </div>
                <h3 className="m-0 text-white fw-bold">Configuración de la Simulación</h3>
            </div>

            {errorValidacion && (
                <Alert variant="danger" className="mb-4" onClose={() => setErrorValidacion(null)} dismissible>
                    {errorValidacion}
                </Alert>
            )}

            {/* Parámetros básicos */}
            <Row className="g-4">
                <Col lg={6} md={6}>
                    <ConfigPanel title="General" icon="⚙️">
                        <CustomInput name="semilla" label="Semilla (RNG)" value={config.semilla} onChange={handleChange} subtitle="n₀ — para reproducibilidad de resultados" />
                        <CustomInput name="dias" label="Días a simular" value={config.dias} onChange={handleChange} subtitle="Jornadas laborables (8 h c/u)" min={1} />
                        <div className="text-secondary mt-auto pt-2" style={{ fontSize: '0.78rem' }}>
                            Generador: <span className="text-white">Congruencial Mixto</span> (Clase 1)
                        </div>
                    </ConfigPanel>
                </Col>

                <Col lg={6} md={6}>
                    <ConfigPanel title="Llegada de lotes" icon="📥">
                        <CustomInput name="lambdaLotes" label="λ — Lotes por día (Poisson)" value={config.lambdaLotes} onChange={handleChange} subtitle="Media de la distribución de Poisson" />
                        <Row className="g-2">
                            <Col xs={6}><CustomInput name="ceBase" label="Equipos: base" value={config.ceBase} onChange={handleChange} subtitle="CE = INT(base + amp·u)" /></Col>
                            <Col xs={6}><CustomInput name="ceSpan" label="Equipos: amplitud" value={config.ceSpan} onChange={handleChange} subtitle="5 + 10u → 5..14" /></Col>
                        </Row>
                    </ConfigPanel>
                </Col>
            </Row>

            {/* Toggle de avanzados */}
            <div className="d-flex justify-content-center my-4">
                <Button variant="link" className="text-decoration-none" style={{ color: '#34d399' }}
                    onClick={() => setMostrarAvanzado(v => !v)}>
                    {mostrarAvanzado ? '▲ Ocultar parámetros avanzados' : '▼ Mostrar parámetros avanzados'}
                </Button>
            </div>

            {mostrarAvanzado && (
                <Row className="g-4">
                    <Col lg={4} md={6}>
                        <ConfigPanel title="Generador (RNG)" icon="🎲">
                            <CustomInput name="a" label="a — multiplicativa" value={config.a} onChange={handleChange} disabled />
                            <CustomInput name="c" label="c — aditiva" value={config.c} onChange={handleChange} disabled />
                            <CustomInput name="m" label="m — módulo" value={config.m} onChange={handleChange} disabled />
                            <div className="text-secondary mt-2" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                                Los valores de <span className="font-monospace text-white">a</span>, <span className="font-monospace text-white">c</span> y <span className="font-monospace text-white">m</span> son los usados por la <span className="text-white">librería estándar de C (glibc)</span>, ampliamente probados.
                                Para cambiar la secuencia de números aleatorios, modificar la <span className="text-white">semilla</span>.
                            </div>
                        </ConfigPanel>
                    </Col>

                    <Col lg={4} md={6}>
                        <ConfigPanel title="Tipos y pesos" icon="🖥️">
                            <Row className="g-2">
                                <Col xs={6}><CustomInput name="tipoCutoff1" label="Corte Servidor" value={config.tipoCutoff1} onChange={handleChange} subtitle="u ≤ 0,25" /></Col>
                                <Col xs={6}><CustomInput name="tipoCutoff2" label="Corte Switch" value={config.tipoCutoff2} onChange={handleChange} subtitle="u ≤ 0,70" /></Col>
                            </Row>
                            <Row className="g-2">
                                <Col xs={6}><CustomInput name="pesoBase" label="Peso: base" value={config.pesoBase} onChange={handleChange} subtitle="0,5 + 19,5u" /></Col>
                                <Col xs={6}><CustomInput name="pesoSpan" label="Peso: amplitud" value={config.pesoSpan} onChange={handleChange} subtitle="kg (igual todos)" /></Col>
                            </Row>
                        </ConfigPanel>
                    </Col>

                    <Col lg={4} md={6}>
                        <ConfigPanel title="Tiempos de proceso (min)" icon="⏱️">
                            <Row className="g-2">
                                <Col xs={6}><CustomInput name="trMu" label="Recepción μ" value={config.trMu} onChange={handleChange} subtitle="Normal" /></Col>
                                <Col xs={6}><CustomInput name="trSigma" label="Recepción σ" value={config.trSigma} onChange={handleChange} subtitle="desvío" /></Col>
                            </Row>
                            <Row className="g-2">
                                <Col xs={6}><CustomInput name="tdBase" label="Diagnóstico base" value={config.tdBase} onChange={handleChange} subtitle="3 + 9u" /></Col>
                                <Col xs={6}><CustomInput name="tdSpan" label="Diagnóstico amp." value={config.tdSpan} onChange={handleChange} subtitle="3..12" /></Col>
                            </Row>
                            <Row className="g-2">
                                <Col xs={6}><CustomInput name="tddBase" label="Desarme base" value={config.tddBase} onChange={handleChange} subtitle="5 + 50u" /></Col>
                                <Col xs={6}><CustomInput name="tddSpan" label="Desarme amp." value={config.tddSpan} onChange={handleChange} subtitle="5..55" /></Col>
                            </Row>
                        </ConfigPanel>
                    </Col>

                    <Col lg={4} md={6}>
                        <ConfigPanel title="Destinos y eficacia" icon="🔀">
                            <CustomInput name="destinoCutoff1" label="Corte Reutilización" value={config.destinoCutoff1} onChange={handleChange} subtitle="u ≤ 0,10 (EF)" />
                            <CustomInput name="destinoCutoff2" label="Corte Desarme" value={config.destinoCutoff2} onChange={handleChange} subtitle="u ≤ 0,85 (ED); resto Disposición" />
                            <CustomInput name="eficaciaCutoff" label="Corte Eficacia" value={config.eficaciaCutoff} onChange={handleChange} subtitle="u ≤ 0,9905 → OK" />
                        </ConfigPanel>
                    </Col>

                    <Col lg={4} md={6}>
                        <ConfigPanel title="Impacto ambiental (litros)" icon="💧">
                            <CustomInput name="agua1" label="Agua / Servidor" value={config.agua1} onChange={handleChange} />
                            <CustomInput name="agua2" label="Agua / Switch-Router" value={config.agua2} onChange={handleChange} />
                            <CustomInput name="agua3" label="Agua / Hogareño" value={config.agua3} onChange={handleChange} />
                        </ConfigPanel>
                    </Col>

                    <Col lg={4} md={6}>
                        <ConfigPanel title="Umbrales de decisión" icon="✅">
                            <CustomInput name="umbralTT" label="Umbral TT (horas)" value={config.umbralTT} onChange={handleChange} subtitle="→ nuevo operario" />
                            <CustomInput name="umbralTTR" label="Umbral TTR (horas)" value={config.umbralTTR} onChange={handleChange} subtitle="→ nuevo recepcionista" />
                            <CustomInput name="umbralTEP" label="Umbral TEP (equipos)" value={config.umbralTEP} onChange={handleChange} subtitle="→ segundo turno" />
                        </ConfigPanel>
                    </Col>
                </Row>
            )}

            {/* Botones de Acción */}
            <div className="d-flex justify-content-center mt-5 gap-3">
                <Button
                    className="border-0 px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        transition: 'all 0.2s ease-in-out',
                        opacity: corriendo ? 0.7 : 1,
                    }}
                    disabled={corriendo}
                    onClick={handleEjecutar}
                    onMouseOver={(e) => { if (!corriendo) e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {corriendo
                        ? (<><Spinner animation="border" size="sm" /> Simulando…</>)
                        : (<><span style={{ fontSize: '1.2rem' }}>▶</span> Ejecutar Simulación</>)}
                </Button>

                <Button
                    variant="dark"
                    className="px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                    style={{ backgroundColor: '#1e293b', color: '#cbd5e1', borderRadius: '8px', transition: 'all 0.2s ease-in-out' }}
                    disabled={corriendo}
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
