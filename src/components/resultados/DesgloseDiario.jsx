import { Table } from 'react-bootstrap';
import { fmtInt, fmt2 } from './format.js';
import EquiposPorDia from './graficos/EquiposPorDia.jsx';

const DesgloseDiario = ({ diario }) => {
    if (!diario || diario.length === 0) return null;

    const tot = diario.reduce((acc, d) => ({
        lotes: acc.lotes + d.lotes,
        equipos: acc.equipos + d.equipos,
        cs: acc.cs + d.cs, cr: acc.cr + d.cr, er: acc.er + d.er,
        pesoDia: acc.pesoDia + d.pesoDia,
        ef: acc.ef + d.ef, ed: acc.ed + d.ed, ei: acc.ei + d.ei,
        pe: acc.pe + d.pe, aguaDia: acc.aguaDia + d.aguaDia,
    }), { lotes: 0, equipos: 0, cs: 0, cr: 0, er: 0, pesoDia: 0, ef: 0, ed: 0, ei: 0, pe: 0, aguaDia: 0 });

    return (
        <div>
            <p className="text-secondary mb-3">Detalle por jornada (cada fila es un día de operación).</p>

            <div className="mb-4">
                <EquiposPorDia diario={diario} />
            </div>

            <div className="overflow-auto">
            <Table striped bordered hover variant="dark" size="sm" style={{ minWidth: '800px' }}>
                <thead>
                    <tr>
                        <th>Día</th><th>Lotes</th><th>Equipos</th>
                        <th>Serv.</th><th>Switch</th><th>Hogar.</th>
                        <th>Peso (kg)</th><th>Reutil.</th><th>Desarme</th><th>Disp.</th>
                        <th>Incid.</th><th>Agua (L)</th>
                    </tr>
                </thead>
                <tbody>
                    {diario.map((d) => (
                        <tr key={d.dia}>
                            <td className="fw-bold">{d.dia}</td>
                            <td>{d.lotes}</td>
                            <td>{d.equipos}</td>
                            <td>{d.cs}</td>
                            <td>{d.cr}</td>
                            <td>{d.er}</td>
                            <td>{fmt2(d.pesoDia)}</td>
                            <td>{d.ef}</td>
                            <td>{d.ed}</td>
                            <td>{d.ei}</td>
                            <td className={d.pe > 0 ? 'text-danger fw-bold' : ''}>{d.pe}</td>
                            <td>{fmtInt(d.aguaDia)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '2px solid #10b981' }}>
                        <th>Total</th>
                        <th>{tot.lotes}</th>
                        <th>{tot.equipos}</th>
                        <th>{tot.cs}</th>
                        <th>{tot.cr}</th>
                        <th>{tot.er}</th>
                        <th>{fmt2(tot.pesoDia)}</th>
                        <th>{tot.ef}</th>
                        <th>{tot.ed}</th>
                        <th>{tot.ei}</th>
                        <th>{tot.pe}</th>
                        <th>{fmtInt(tot.aguaDia)}</th>
                    </tr>
                </tfoot>
            </Table>
            </div>
        </div>
    );
};

export default DesgloseDiario;
