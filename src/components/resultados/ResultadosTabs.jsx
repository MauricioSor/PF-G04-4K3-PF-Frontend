import { Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import ResumenMensual from './ResumenMensual.jsx';
import DesgloseDiario from './DesgloseDiario.jsx';
import GrillaEquipos from './GrillaEquipos.jsx';
import Decisiones from './Decisiones.jsx';
import GlosarioVariables from './GlosarioVariables.jsx';
import HistogramaUniforme from './graficos/HistogramaUniforme.jsx';

// Contenedor de resultados en pestañas ("diferentes ventanas" para las capturas).
const ResultadosTabs = ({ resultado }) => {
    if (!resultado) return null;
    const { resumen, diario, grilla, decisiones, rng } = resultado;

    return (
        <Container className="py-5" id="resultados">
            <style>{`
                #resultados .nav-tabs { border-bottom: 1px solid rgba(255,255,255,0.1); }
                #resultados .nav-tabs .nav-link { color: #94a3b8; border: none; }
                #resultados .nav-tabs .nav-link:hover { color: #e2e8f0; border: none; }
                #resultados .nav-tabs .nav-link.active {
                    color: #34d399; background: transparent;
                    border: none; border-bottom: 2px solid #10b981;
                }
            `}</style>

            <div className="d-flex align-items-center mb-4">
                <div className="d-flex justify-content-center align-items-center rounded me-3"
                    style={{ width: '35px', height: '35px', backgroundColor: '#064e3b' }}>
                    <span style={{ fontSize: '1.2rem', color: '#34d399' }}>📊</span>
                </div>
                <h3 className="m-0 text-white fw-bold">Resultados de la Simulación</h3>
                <span className="ms-auto text-secondary" style={{ fontSize: '0.8rem' }}>
                    Generador: {rng.type} · semilla {rng.seed}
                </span>
            </div>

            <Row className="g-4">
                <Col lg={9}>
                    <Card className="border-0 shadow-lg" style={{ backgroundColor: '#0f172a', borderRadius: '20px' }}>
                        <Card.Body className="p-4">
                            <Tabs defaultActiveKey="resumen" className="mb-4" variant="tabs">
                                <Tab eventKey="resumen" title="📈 Resumen mensual">
                                    <ResumenMensual resumen={resumen} diario={diario} />
                                </Tab>
                                <Tab eventKey="diario" title="📅 Desglose diario">
                                    <DesgloseDiario diario={diario} />
                                </Tab>
                                <Tab eventKey="grilla" title="🧮 Grilla de eventos">
                                    <GrillaEquipos grilla={grilla} totalU={rng.totalUConsumidos} />
                                </Tab>
                                <Tab eventKey="decisiones" title="✅ Decisiones">
                                    <Decisiones decisiones={decisiones} />
                                </Tab>
                                <Tab eventKey="generador" title="🎲 Generador">
                                    <HistogramaUniforme grilla={grilla} />
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3}>
                    <div style={{ position: 'sticky', top: '1rem' }}>
                        <GlosarioVariables />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ResultadosTabs;
