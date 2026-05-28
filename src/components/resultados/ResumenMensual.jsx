import { Row, Col } from 'react-bootstrap';
import { fmtInt, fmt2 } from './format.js';
import Donuts from './graficos/Donuts.jsx';
import AcumuladoMensual from './graficos/AcumuladoMensual.jsx';

const StatCard = ({ icon, title, value, unit, color }) => (
    <div className="d-flex flex-column h-100 p-3" style={{
        backgroundColor: '#1e293b',
        border: `1.5px solid ${color}`,
        borderRadius: '14px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    }}>
        <div className="d-flex align-items-center mb-2">
            <span style={{ fontSize: '1.3rem' }} className="me-2">{icon}</span>
            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>{title}</span>
        </div>
        <div className="mt-auto fw-bold text-white" style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>
            {value}
            {unit && <span className="text-secondary ms-1" style={{ fontSize: '0.8rem' }}>{unit}</span>}
        </div>
    </div>
);

const SectionTitle = ({ children }) => (
    <h5 className="text-white fw-bold mt-4 mb-3" style={{ fontSize: '1rem' }}>{children}</h5>
);

const ResumenMensual = ({ resumen, diario }) => {
    if (!resumen) return null;
    const r = resumen;

    return (
        <div>
            <p className="text-secondary mb-1">
                Resultados acumulados de <span className="text-white fw-bold">{r.dias}</span> días simulados
                · <span className="text-white fw-bold">{fmtInt(r.totalLotes)}</span> lotes ingresados.
            </p>

            <SectionTitle>Distribuciones empíricas</SectionTitle>
            <Donuts resumen={r} />

            <SectionTitle>Producción</SectionTitle>
            <Row className="g-3">
                <Col md={3} sm={6}><StatCard icon="📦" title="Total equipos procesados (TEP)" value={fmtInt(r.tep)} color="rgba(16,185,129,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="🖥️" title="Servidores (CS)" value={fmtInt(r.cs)} color="rgba(59,130,246,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="🌐" title="Switch/Routers (CR)" value={fmtInt(r.cr)} color="rgba(168,85,247,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="🏠" title="Hogareños (ER)" value={fmtInt(r.er)} color="rgba(245,158,11,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="⚖️" title="Peso total procesado (PT)" value={fmt2(r.pt)} unit="kg" color="rgba(16,185,129,0.6)" /></Col>
            </Row>

            <SectionTitle>Destinos del diagnóstico</SectionTitle>
            <Row className="g-3">
                <Col md={4} sm={6}><StatCard icon="♻️" title="Reutilización (EF)" value={fmtInt(r.ef)} color="rgba(16,185,129,0.6)" /></Col>
                <Col md={4} sm={6}><StatCard icon="🔧" title="Desarme (ED)" value={fmtInt(r.ed)} color="rgba(245,158,11,0.6)" /></Col>
                <Col md={4} sm={6}><StatCard icon="🗑️" title="Disposición final (EI)" value={fmtInt(r.ei)} color="rgba(239,68,68,0.6)" /></Col>
            </Row>

            <SectionTitle>Impacto ambiental y calidad</SectionTitle>
            <Row className="g-3">
                <Col md={6} sm={6}><StatCard icon="💧" title="Agua no contaminada (TA)" value={fmtInt(r.ta)} unit="litros" color="rgba(59,130,246,0.6)" /></Col>
                <Col md={6} sm={6}><StatCard icon="⚠️" title="Incidentes de contaminación (PE)" value={fmtInt(r.pe)} color="rgba(239,68,68,0.6)" /></Col>
            </Row>

            <SectionTitle>Tiempos acumulados</SectionTitle>
            <Row className="g-3">
                <Col md={3} sm={6}><StatCard icon="📋" title="Total recepción (TTR)" value={fmt2(r.ttrHoras)} unit="h" color="rgba(168,85,247,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="🔍" title="Total diagnóstico (TTD)" value={fmt2(r.ttd / 60)} unit="h" color="rgba(168,85,247,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="🔧" title="Total desarme (TTDD)" value={fmt2(r.ttdd / 60)} unit="h" color="rgba(168,85,247,0.6)" /></Col>
                <Col md={3} sm={6}><StatCard icon="⏱️" title="Tiempo total (TT = TTD+TTDD)" value={fmt2(r.ttHoras)} unit="h" color="rgba(16,185,129,0.6)" /></Col>
            </Row>

            <SectionTitle>Evolución del mes</SectionTitle>
            <AcumuladoMensual diario={diario} />
        </div>
    );
};

export default ResumenMensual;
