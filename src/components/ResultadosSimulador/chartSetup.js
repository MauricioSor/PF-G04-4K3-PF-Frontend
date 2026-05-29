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
  Title,
} from 'chart.js'

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
  Title,
)

Chart.defaults.color = '#94a3b8'
Chart.defaults.borderColor = 'rgba(255,255,255,0.07)'
Chart.defaults.font.family = "'Inter', system-ui, sans-serif"
Chart.defaults.font.size = 11
