import { Doughnut } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import ChartCard from './ChartCard.jsx';

// Dos donuts en paralelo: distribución por tipo de equipo y por destino del diagnóstico.
const Donuts = ({ resumen }) => {
    if (!resumen || resumen.tep === 0) return null;

    const dataTipo = {
        labels: ['Servidor', 'Switch/Router', 'Hogareño'],
        datasets: [{
            data: [resumen.cs, resumen.cr, resumen.er],
            backgroundColor: ['#60a5fa', '#c084fc', '#f59e0b'],
            borderColor: '#0f172a',
            borderWidth: 2,
        }],
    };

    const dataDestino = {
        labels: ['Reutilización', 'Desarme', 'Disposición final'],
        datasets: [{
            data: [resumen.ef, resumen.ed, resumen.ei],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderColor: '#0f172a',
            borderWidth: 2,
        }],
    };

    const opciones = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { padding: 12, boxWidth: 12 } },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct = total ? (ctx.raw / total * 100).toFixed(1) : 0;
                        return `${ctx.label}: ${ctx.raw.toLocaleString('es-AR')} (${pct}%)`;
                    },
                },
            },
        },
        cutout: '60%',
    };

    return (
        <Row className="g-3">
            <Col md={6}>
                <ChartCard title="Distribución por tipo de equipo"
                    subtitle="Modelo teórico: Servidor 25% · Switch/Router 45% · Hogareño 30%">
                    <Doughnut data={dataTipo} options={opciones} />
                </ChartCard>
            </Col>
            <Col md={6}>
                <ChartCard title="Distribución por destino del diagnóstico"
                    subtitle="Modelo teórico: Reutilización 10% · Desarme 75% · Disposición 15%">
                    <Doughnut data={dataDestino} options={opciones} />
                </ChartCard>
            </Col>
        </Row>
    );
};

export default Donuts;
