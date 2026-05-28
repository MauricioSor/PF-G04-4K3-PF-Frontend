import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import ChartCard from './ChartCard.jsx';
import { fmtInt, fmt2 } from '../format.js';

// Recolecta TODOS los u que la simulación efectivamente consumió, leyéndolos
// de la grilla por equipo. Es la forma más fiel de auditar la calidad del RNG.
function recolectarUs(grilla) {
    const us = [];
    for (const r of grilla) {
        us.push(r.uTipo, r.uPeso, r.uTR1, r.uTR2, r.uTD, r.uDestino, r.uEficacia);
        if (r.uTDD != null) us.push(r.uTDD);
    }
    return us;
}

const Stat = ({ label, value }) => (
    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.85rem' }}>
        <span className="text-secondary">{label}</span>
        <span className="text-white font-monospace fw-bold">{value}</span>
    </div>
);

const HistogramaUniforme = ({ grilla }) => {
    const stats = useMemo(() => {
        const us = recolectarUs(grilla);
        const n = us.length;
        if (n === 0) return null;
        const bins = new Array(10).fill(0);
        let sum = 0;
        let min = 1;
        let max = 0;
        for (const u of us) {
            const i = Math.min(9, Math.floor(u * 10));
            bins[i] += 1;
            sum += u;
            if (u < min) min = u;
            if (u > max) max = u;
        }
        const esperado = n / 10;
        const desviacionMax = Math.max(...bins.map((b) => Math.abs(b - esperado)));
        return { bins, n, mean: sum / n, min, max, esperado, desviacionMax };
    }, [grilla]);

    if (!stats) return null;

    const labels = ['0,0–0,1', '0,1–0,2', '0,2–0,3', '0,3–0,4', '0,4–0,5', '0,5–0,6', '0,6–0,7', '0,7–0,8', '0,8–0,9', '0,9–1,0'];

    const data = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Frecuencia observada',
                data: stats.bins,
                backgroundColor: '#34d399',
                borderRadius: 4,
                order: 2,
            },
            {
                type: 'line',
                label: `Frecuencia esperada (uniforme: ${fmtInt(stats.esperado)})`,
                data: new Array(10).fill(stats.esperado),
                borderColor: '#fbbf24',
                borderWidth: 2,
                borderDash: [6, 4],
                pointRadius: 0,
                tension: 0,
                fill: false,
                order: 1,
            },
        ],
    };

    const opciones = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8' },
                title: { display: true, text: 'Cantidad de u', color: '#94a3b8' },
            },
        },
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 14, padding: 12 } },
        },
    };

    return (
        <div>
            <p className="text-secondary mb-3">
                Histograma de los <span className="text-white fw-bold">{fmtInt(stats.n)}</span> números
                aleatorios <span className="font-monospace text-white">u</span> que la simulación efectivamente consumió,
                agrupados en 10 deciles. Si el generador es uniforme, todas las barras deberían acercarse
                a la línea punteada (frecuencia esperada).
            </p>

            <Row className="g-3">
                <Col lg={8}>
                    <ChartCard title="Distribución de frecuencias de la uniforme u(0,1)"
                        subtitle="Validación visual de la uniformidad del generador (Clase 2 – Pruebas estadísticas)"
                        height={340}>
                        <Bar data={data} options={opciones} />
                    </ChartCard>
                </Col>
                <Col lg={4}>
                    <div className="p-3 h-100" style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '14px',
                    }}>
                        <div className="text-white fw-bold mb-3" style={{ fontSize: '0.9rem' }}>
                            Estadísticas de la muestra
                        </div>
                        <Stat label="Cantidad (n)" value={fmtInt(stats.n)} />
                        <Stat label="Media muestral" value={fmt2(stats.mean)} />
                        <Stat label="Media esperada" value="0,50" />
                        <Stat label="Mínimo observado" value={stats.min.toFixed(4)} />
                        <Stat label="Máximo observado" value={stats.max.toFixed(4)} />
                        <Stat label="Frec. esperada / decil" value={fmt2(stats.esperado)} />
                        <Stat label="Desvío máx. vs esperado" value={fmtInt(stats.desviacionMax)} />

                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                                Cuanto más cerca de <span className="font-monospace text-white">0,5</span> esté la media muestral, y cuanto más
                                parejas estén las 10 barras, mejor calidad de uniformidad presenta el generador congruencial mixto sembrado.
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HistogramaUniforme;
