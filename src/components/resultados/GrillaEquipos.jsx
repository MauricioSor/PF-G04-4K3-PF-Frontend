import { useState } from 'react';
import { Table, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { fmtInt, fmt2, fmtU } from './format.js';

const destinoColor = { EF: '#10b981', ED: '#f59e0b', EI: '#ef4444' };

const GrillaEquipos = ({ grilla, totalU }) => {
    const total = grilla?.length ?? 0;
    const [desde, setDesde] = useState(1);
    const [cantidad, setCantidad] = useState(50);

    if (total === 0) return null;

    const inicio = Math.min(Math.max(1, Number(desde) || 1), total);
    const cant = Math.max(1, Number(cantidad) || 50);
    const fin = Math.min(inicio - 1 + cant, total);
    const filas = grilla.slice(inicio - 1, fin);

    const irAnterior = () => setDesde(Math.max(1, inicio - cant));
    const irSiguiente = () => setDesde(fin + 1 <= total ? fin + 1 : inicio);

    return (
        <div>
            <p className="text-secondary mb-3">
                Vector de estado: una fila por equipo, con el número aleatorio (u) usado en cada
                variable y el valor resultante. Total de números aleatorios consumidos:{' '}
                <span className="text-white fw-bold">{fmtInt(totalU)}</span>.
            </p>

            <Row className="g-2 align-items-end mb-3">
                <Col xs={6} md={3}>
                    <Form.Label className="text-light" style={{ fontSize: '0.8rem' }}>Mostrar desde fila</Form.Label>
                    <Form.Control type="number" min={1} max={total} value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                        className="text-white" style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                </Col>
                <Col xs={6} md={3}>
                    <Form.Label className="text-light" style={{ fontSize: '0.8rem' }}>Cantidad</Form.Label>
                    <Form.Select value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}
                        className="text-white" style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {[25, 50, 100, 200].map(n => <option key={n} value={n}>{n}</option>)}
                    </Form.Select>
                </Col>
                <Col xs={12} md={6} className="d-flex gap-2">
                    <Button variant="outline-light" size="sm" onClick={irAnterior} disabled={inicio <= 1}>◀ Anterior</Button>
                    <Button variant="outline-light" size="sm" onClick={irSiguiente} disabled={fin >= total}>Siguiente ▶</Button>
                    <span className="text-secondary align-self-center ms-auto" style={{ fontSize: '0.8rem' }}>
                        Mostrando filas {fmtInt(inicio)}–{fmtInt(fin)} de {fmtInt(total)}
                    </span>
                </Col>
            </Row>

            <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
                <Table striped bordered hover variant="dark" size="sm" style={{ minWidth: '1500px', fontSize: '0.8rem' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                            <th>#</th><th>Día</th><th>Lote</th><th>Eq.</th>
                            <th>u·Tipo</th><th>Tipo</th>
                            <th>u·Peso</th><th>Peso (kg)</th>
                            <th>u·TR₁</th><th>u·TR₂</th><th>TR (min)</th>
                            <th>u·TD</th><th>TD (min)</th>
                            <th>u·Dest.</th><th>Destino</th>
                            <th>u·TDD</th><th>TDD (min)</th>
                            <th>u·Efic.</th><th>Resultado</th><th>Agua (L)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((f) => (
                            <tr key={f.idx}>
                                <td className="fw-bold">{f.idx}</td>
                                <td>{f.dia}</td>
                                <td>{f.lote}</td>
                                <td>{f.equipoEnLote}</td>
                                <td>{fmtU(f.uTipo)}</td>
                                <td>{f.tipoLabel}</td>
                                <td>{fmtU(f.uPeso)}</td>
                                <td>{fmt2(f.peso)}</td>
                                <td>{fmtU(f.uTR1)}</td>
                                <td>{fmtU(f.uTR2)}</td>
                                <td>{fmt2(f.tr)}</td>
                                <td>{fmtU(f.uTD)}</td>
                                <td>{fmt2(f.td)}</td>
                                <td>{fmtU(f.uDestino)}</td>
                                <td style={{ color: destinoColor[f.destino], fontWeight: 600 }}>{f.destinoLabel}</td>
                                <td>{fmtU(f.uTDD)}</td>
                                <td>{f.tdd == null ? '—' : fmt2(f.tdd)}</td>
                                <td>{fmtU(f.uEficacia)}</td>
                                <td>
                                    {f.ok
                                        ? <Badge bg="success">OK</Badge>
                                        : <Badge bg="danger">Incidente</Badge>}
                                </td>
                                <td>{f.agua === 0 ? '—' : fmtInt(f.agua)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default GrillaEquipos;
