import { Bar } from 'react-chartjs-2';
import ChartCard from './ChartCard.jsx';

// Barras apiladas: cantidad de equipos procesados por día, desglosados por tipo.
// Muestra la variabilidad diaria que genera la Poisson(λ=6) de los lotes.
const EquiposPorDia = ({ diario }) => {
    if (!diario || diario.length === 0) return null;

    const labels = diario.map((d) => `D${d.dia}`);

    const data = {
        labels,
        datasets: [
            { label: 'Servidor', data: diario.map((d) => d.cs), backgroundColor: '#60a5fa', stack: 'eq' },
            { label: 'Switch/Router', data: diario.map((d) => d.cr), backgroundColor: '#c084fc', stack: 'eq' },
            { label: 'Hogareño', data: diario.map((d) => d.er), backgroundColor: '#f59e0b', stack: 'eq' },
        ],
    };

    const opciones = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: {
                stacked: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, autoSkipPadding: 4 },
            },
            y: {
                stacked: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8' },
                title: { display: true, text: 'Equipos', color: '#94a3b8' },
            },
        },
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, padding: 12 } },
            tooltip: {
                callbacks: {
                    footer: (items) => {
                        const total = items.reduce((s, it) => s + it.parsed.y, 0);
                        return `Total: ${total}`;
                    },
                },
            },
        },
    };

    return (
        <ChartCard
            title="Equipos procesados por día"
            subtitle="Apilados por tipo. Refleja la variabilidad de la Poisson(λ=6) en la cantidad de lotes diarios."
            height={300}
        >
            <Bar data={data} options={opciones} />
        </ChartCard>
    );
};

export default EquiposPorDia;
