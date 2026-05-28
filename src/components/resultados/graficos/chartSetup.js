// Registra una sola vez los controladores/elementos de chart.js que vamos a usar
// (Doughnut, Bar, Line) y aplica los defaults del tema oscuro.
import {
    Chart,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

Chart.register(
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
);

Chart.defaults.color = '#cbd5e1';
Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';
Chart.defaults.font.family = 'system-ui, sans-serif';
Chart.defaults.font.size = 12;
