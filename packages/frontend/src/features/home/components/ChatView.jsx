import { useState } from 'react';

const ChatView = ({ event, purchase, participantName, senderLabel, backLabel, onBack, onSend }) => {
    const [message, setMessage] = useState('');

    const submitMessage = (formEvent) => {
        formEvent.preventDefault();
        const text = message.trim();
        if (!text) return;
        onSend(purchase.id, text);
        setMessage('');
    };

    return (
        <section aria-labelledby="h-chat">
            <button type="button" className="button-secondary" onClick={onBack}>
                ← {backLabel}
            </button>
            <h1 id="h-chat" className="section-title" tabIndex="-1">Mensajes de la compra</h1>
            <p className="muted">{event.nombre} · Hablás con {participantName}</p>
            <div className="chat-log" role="log" aria-live="polite" aria-label="Historial de mensajes">
                {purchase.mensajes.map((item, index) => (
                    <div className={`chat-message${item.me ? ' chat-message-mine' : ''}`} key={`${item.hora}-${index}`}>
                        <strong>{item.me ? senderLabel : item.autor}</strong>
                        <p>{item.texto}</p>
                        <time>{item.hora}</time>
                    </div>
                ))}
                {purchase.mensajes.length === 0 && (
                    <p className="muted">Todavía no hay mensajes. Podés hacer una consulta sobre el evento.</p>
                )}
            </div>
            <form className="chat-form" onSubmit={submitMessage}>
                <label htmlFor="chat-message">Escribí tu mensaje</label>
                <textarea
                    id="chat-message"
                    rows="2"
                    required
                    value={message}
                    onChange={(eventChange) => setMessage(eventChange.target.value)}
                    onKeyDown={(eventKey) => {
                        if (
                            eventKey.key === 'Enter'
                            && !eventKey.shiftKey
                            && !eventKey.nativeEvent.isComposing
                        ) {
                            eventKey.preventDefault();
                            eventKey.currentTarget.form.requestSubmit();
                        }
                    }}
                />
                <p className="muted">Enter envía · Shift + Enter hace un salto de línea</p>
                <button type="submit" className="button-primary">Enviar mensaje</button>
            </form>
        </section>
    );
};

export default ChatView;
