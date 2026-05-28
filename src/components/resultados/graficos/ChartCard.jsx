// Wrapper común para todos los gráficos: tarjeta dark + título + altura fija
// (los charts de react-chartjs-2 necesitan un contenedor con altura definida).

const ChartCard = ({ title, subtitle, height = 280, children }) => (
    <div className="p-3 h-100" style={{
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
    }}>
        <div className="mb-2">
            <div className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>{title}</div>
            {subtitle && <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{subtitle}</div>}
        </div>
        <div style={{ height: `${height}px`, position: 'relative' }}>
            {children}
        </div>
    </div>
);

export default ChartCard;
