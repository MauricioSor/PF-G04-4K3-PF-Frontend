// Glosario de las variables del modelo (siglas del diagrama de flujo TFI).
// Se muestra al costado de los resultados como referencia rápida.

const GRUPOS = [
    {
        titulo: 'Control de la simulación',
        color: '#34d399',
        items: [
            ['d', 'Día simulado (1..30)'],
            ['u', 'Número aleatorio (0 ≤ u < 1)'],
            ['L', 'Cantidad de lotes por día'],
            ['CE', 'Cantidad de equipos por lote'],
        ],
    },
    {
        titulo: 'Tipos de equipo',
        color: '#60a5fa',
        items: [
            ['Tipo 1', 'Servidor (Rack/Blade)'],
            ['Tipo 2', 'Switch / Router industrial'],
            ['Tipo 3', 'Equipo de red hogareño'],
            ['CS', 'Cantidad de servidores'],
            ['CR', 'Cantidad de switch/routers'],
            ['ER', 'Cantidad de equipos hogareños'],
        ],
    },
    {
        titulo: 'Pesos (kg)',
        color: '#c084fc',
        items: [
            ['PS', 'Peso del servidor'],
            ['PR', 'Peso del switch/router'],
            ['PER', 'Peso del equipo hogareño'],
            ['PT', 'Peso total procesado'],
        ],
    },
    {
        titulo: 'Tiempos (min)',
        color: '#f59e0b',
        items: [
            ['TR', 'Tiempo de recepción'],
            ['TD', 'Tiempo de diagnóstico'],
            ['TDD', 'Tiempo de desarme'],
            ['TTR', 'Tiempo total de recepción'],
            ['TTD', 'Tiempo total de diagnóstico'],
            ['TTDD', 'Tiempo total de desarme'],
            ['TT', 'Tiempo total (TTD + TTDD)'],
        ],
    },
    {
        titulo: 'Destino del diagnóstico',
        color: '#fb7185',
        items: [
            ['EF', 'Equipos funcionales (reutilización)'],
            ['ED', 'Equipos para desarme'],
            ['EI', 'Equipos irrecuperables (disposición)'],
        ],
    },
    {
        titulo: 'Calidad e impacto',
        color: '#22d3ee',
        items: [
            ['PC', 'Procesado correcto'],
            ['PE', 'Incidentes de contaminación'],
            ['TA', 'Litros de agua no contaminada'],
            ['TEP', 'Total de equipos procesados'],
        ],
    },
];

const GlosarioVariables = () => (
    <div className="p-3" style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        maxHeight: '85vh',
        overflowY: 'auto',
    }}>
        <div className="d-flex align-items-center mb-3">
            <span style={{ fontSize: '1.2rem' }} className="me-2">📖</span>
            <h6 className="m-0 text-white fw-bold">Glosario de variables</h6>
        </div>

        {GRUPOS.map((g) => (
            <div key={g.titulo} className="mb-3">
                <div className="fw-bold mb-2" style={{ color: g.color, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {g.titulo}
                </div>
                {g.items.map(([sigla, desc]) => (
                    <div key={sigla} className="d-flex mb-1" style={{ fontSize: '0.8rem' }}>
                        <span className="font-monospace fw-bold text-white flex-shrink-0" style={{ width: '52px' }}>{sigla}</span>
                        <span className="text-secondary">{desc}</span>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

export default GlosarioVariables;
