
export default function EntradaMensagem({
  texto,
  setTexto,
  enviar,
  carregando
}) {
  return (
    <form className="entrada" onSubmit={enviar}>
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escreva sua mensagem..."
        disabled={carregando}
      />

      <button
        type="submit"
        disabled={carregando || !texto.trim()}
      >
        {carregando ? "..." : "Enviar ↑"}
      </button>
    </form>
  );
}
