const statusLabels = {
    PENDIENTE: 'Pendiente de pago',
    CONFIRMADA: 'Confirmada',
    UTILIZADA: 'Utilizada',
    CANCELADA: 'Cancelada',
    REEMBOLSADA: 'Reembolsada',
};

const EstadoBadge = ({ status }) => (
    <span className={`event-status status-${status}`}>
        <span aria-hidden="true">{status === 'CONFIRMADA' ? '✓' : status === 'PENDIENTE' ? '◷' : status === 'CANCELADA' ? '×' : '•'}</span>
        {statusLabels[status] || status}
    </span>
);

export default EstadoBadge;
