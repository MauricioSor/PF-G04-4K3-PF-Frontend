import { Row, Col, Badge } from 'react-bootstrap';
import { fmtInt, fmt2 } from './format.js';

const ICONO = { operario: '👷', recepcionista: '📋', segundoTurno: '🕒' };
const TITULO = {
    operario: '¿Incorporar un nuevo operario?',
    recepcionista: '¿Incorporar un nuevo recepcionista?',
    segundoTurno: '¿Habilitar un segundo turno?',
};

const formatValor = (d) => (d.unidad === 'equipos' ? fmtInt(d.valor) : fmt2(d.valor));

const DecisionCard = ({ d }) => {
    const color = d.cumple ? '#10b981' : '#64748b';
    return (
        <div className="h-100 p-4 d-flex flex-column" style={{
            backgroundColor: '#0f172a',
            border: `2px solid ${color}`,
            borderRadius: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
        }}>
            <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: '1.6rem' }} className="me-2">{ICONO[d.clave]}</span>
                <h6 className="m-0 text-white fw-bold">{TITULO[d.clave]}</h6>
            </div>

            <div className="mb-2">
                <Badge bg={d.cumple ? 'success' : 'secondary'}>
                    {d.cumple ? 'CONDICIÓN CUMPLIDA' : 'CONDICIÓN NO CUMPLIDA'}
                </Badge>
            </div>

            <div className="text-secondary mb-1" style={{ fontSize: '0.85rem' }}>
                Condición: <span className="text-white font-monospace">{d.condicion}</span>
            </div>
            <div className="text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                Valor obtenido: <span className="text-white fw-bold">{formatValor(d)} {d.unidad}</span>
                {' '}(umbral: {fmtInt(d.umbral)})
            </div>

            <div className="mt-auto p-3 rounded" style={{
                backgroundColor: d.cumple ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
            }}>
                <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Recomendación</div>
                <div className="text-white fw-bold" style={{ fontSize: '0.95rem' }}>{d.mensaje}</div>
            </div>
        </div>
    );
};

const Decisiones = ({ decisiones }) => {
    if (!decisiones || decisiones.length === 0) return null;
    return (
        <div>
            <p className="text-secondary mb-4">
                Alternativas de decisión que el responsable de Nave Tierra evalúa a partir de los resultados
                de la simulación (lógica IF–THEN–ELSE del modelo).
            </p>
            <Row className="g-4">
                {decisiones.map((d) => (
                    <Col lg={4} md={6} key={d.clave}>
                        <DecisionCard d={d} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Decisiones;
