
export default function Conversa({
  mensagens,
  carregando,
  fim
}) {
  return (
    <div className="conversa">
      {mensagens.map((m, i) => (
        <div
          className={`mensagem ${m.role}`}
          key={i}
        >
          <strong>
            {m.role === "user" ? "Você" : "Zói"}
          </strong>

          <p>{m.content}</p>
        </div>
      ))}

      {carregando && (
        <div className="mensagem assistant">
          <strong>Zói</strong>
          <p>Estou pensando...</p>
        </div>
      )}

      <div ref={fim} />
    </div>
  );
}
