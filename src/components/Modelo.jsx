
import { Card, Container } from 'react-bootstrap';

const NodeCard = ({ icon, title, subtitle, value, valueColor, borderColor }) => (
    <div 
        className="d-flex flex-column align-items-center justify-content-center flex-shrink-0 p-3" 
        style={{ 
            width: '140px', 
            minHeight: '145px',
            border: `1.5px solid ${borderColor}`,
            backgroundColor: '#1e293b', // Fondo sólido oscuro para que la tarjeta sea visible
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}
    >
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
        
        <div className="fw-bold text-white text-center" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>
            {title}
        </div>
        
        {subtitle && (
            <div className="text-secondary mt-1 text-center" style={{ fontSize: '0.7rem' }}>
                {subtitle}
            </div>
        )}
        
        <div className="fw-bold mt-auto pt-2" style={{ color: valueColor, fontSize: '1.15rem' }}>
            {value}
        </div>
    </div>
);

const Arrow = () => (
    <div className="mx-2 d-flex align-items-center flex-shrink-0" style={{ color: '#059669', fontSize: '1.8rem' }}>
        ⟶
    </div>
);

const ModeloDelSistema = () => {
    return (
        <Container className="p-3 my-5 " style={{borderRadius: '20px', background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'}}>
            
            <div className="d-flex justify-content-center p-4 align-items-center  mb-4">
                <h3 className="m-0 text-white fw-bold fs-2">Modelo del Sistema</h3>
            </div>
            <Card 
                className="border-0 shadow-lg" 
                style={{ 
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <Card.Body className="p-4 overflow-auto">
                    <div className="d-flex align-items-center justify-content-center" style={{ minWidth: '950px', gap: '5px' }}>
                        
                        <NodeCard 
                            icon="📥" 
                            title="Llegadas" 
                            value="32" 
                            valueColor="#10b981" 
                            borderColor="rgba(59, 130, 246, 0.6)" // Azul
                        />

                        <Arrow />

                        <NodeCard 
                            icon="⏳" 
                            title="Cola Recepción" 
                            value="Ø 0.75" 
                            valueColor="#f59e0b" 
                            borderColor="rgba(245, 158, 11, 0.6)" // Naranja
                        />

                        <Arrow />

                        <NodeCard 
                            icon="📋" 
                            title="Recepción" 
                            subtitle="(1 servidor)"
                            value="63.2%" 
                            valueColor="#10b981" 
                            borderColor="rgba(16, 185, 129, 0.6)" // Verde
                        />

                        <Arrow />

                        <NodeCard 
                            icon="⏳" 
                            title="Cola Procesam." 
                            value="Ø 1.93" 
                            valueColor="#f59e0b" 
                            borderColor="rgba(245, 158, 11, 0.6)" 
                        />

                        <Arrow />

                        <div className="d-flex flex-column gap-3 flex-shrink-0">
                            <NodeCard 
                                icon="⚙️" 
                                title="Procesador 1" 
                                value="88.2%" 
                                valueColor="#c084fc" 
                                borderColor="rgba(168, 85, 247, 0.6)" // Morado
                            />
                            <NodeCard 
                                icon="⚙️" 
                                title="Procesador 2" 
                                value="77.9%" 
                                valueColor="#c084fc" 
                                borderColor="rgba(168, 85, 247, 0.6)" 
                            />
                        </div>

                        <Arrow />

                        <NodeCard 
                            icon="✅" 
                            title="Completados" 
                            value="25" 
                            valueColor="#10b981" 
                            borderColor="rgba(16, 185, 129, 0.6)" 
                        />

                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ModeloDelSistema;