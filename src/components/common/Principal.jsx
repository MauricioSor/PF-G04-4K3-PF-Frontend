import React from 'react';
import { Card, Container, Badge, Button } from 'react-bootstrap';

const Principal = () => {
    return (
        <Container className="d-flex justify-content-center mt-5 px-3">
            <Card
                className="text-center shadow-lg border-0 rounded-4 overflow-hidden"
                style={{
                    width: '100%',
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    color: '#ffffff'
                }}
            >
                <div style={{ height: '8px', background: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)' }}></div>
                <Card.Body className="p-sm-5 p-4">
                    <Badge
                        bg="transparent"
                        className="mb-4 px-3 py-2 rounded-pill fs-6 fw-normal border border-info text-info"
                        style={{ letterSpacing: '1px' }}
                    >
                        TFI - G04 UTN-FRT
                    </Badge>
                    <Card.Title as="h1" className="display-4 fw-bold mb-4">
                        ¡Bienvenido al software de simulación!<br />
                        <span style={{ color: '#00d2ff' }}></span>
                    </Card.Title>
                    <Card.Subtitle className="mb-4  opacity-75 fs-3 fw-light">
                        Nave Tierra - San Miguel de Tucumán
                    </Card.Subtitle>
                </Card.Body>
                <Card.Footer className="text-muted border-0 py-3 " style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <small className='text-white'>Investigación Operativa - Grupo 04</small>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Principal;