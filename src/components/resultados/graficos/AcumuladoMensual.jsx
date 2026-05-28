import { Line } from 'react-chartjs-2';
import ChartCard from './ChartCard.jsx';

// Líneas con dos ejes Y: TEP acumulado (izquierda) y litros de agua acumulada (derecha).
const AcumuladoMensual = ({ diario }) => {
    if (!diario || diario.length === 0) return null;

    let tepAcum = 0;
    let aguaAcum = 0;
    const labels = [];
    const tep = [];
    const agua = [];
    for (const d of diario) {
        tepAcum += d.equipos;
        aguaAcum += d.aguaDia;
        labels.push(`D${d.dia}`);
        tep.push(tepAcum);
        agua.push(aguaAcum);
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'TEP acumulado',
                data: tep,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.15)',
                yAxisID: 'y1',
                tension: 0.25,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            },
            {
                label: 'Agua no contaminada (L)',
                data: agua,
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34,211,238,0.08)',
                yAxisID: 'y2',
                tension: 0.25,
                pointRadius: 2,
                pointHoverRadius: 4,
            },
        ],
    };

    const opciones = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, autoSkipPadding: 4 },
            },
            y1: {
                position: 'left',
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#10b981' },
                title: { display: true, text: 'Equipos (TEP)', color: '#10b981' },
            },
            y2: {
                position: 'right',
                grid: { display: false },
                ticks: { color: '#22d3ee', callback: (v) => `${(v / 1_000_000).toFixed(1)}M` },
                title: { display: true, text: 'Litros de agua', color: '#22d3ee' },
            },
        },
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 14, padding: 12 } },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const v = ctx.parsed.y.toLocaleString('es-AR');
                        const unidad = ctx.dataset.yAxisID === 'y2' ? 'L' : 'eq.';
                        return `${ctx.dataset.label}: ${v} ${unidad}`;
                    },
                },
            },
        },
    };

    return (
        <ChartCard
            title="Evolución acumulada a lo largo del mes"
            subtitle="Equipos procesados (TEP) y litros de agua no contaminada, día por día."
            height={320}
        >
            <Line data={data} options={opciones} />
        </ChartCard>
    );
};

export default AcumuladoMensual;
