
"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [idioma, setIdioma] = useState("Inglês");
  const [nivel, setNivel] = useState("Iniciante");
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState([
    {
      role: "assistant",
      content:
        "Hi! Eu sou o Zói! Vamos praticar um idioma juntos? Pode começar falando comigo!"
    }
  ]);
  const [carregando, setCarregando] = useState(false);
  const fim = useRef(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  async function enviar(e) {
    e.preventDefault();

    if (!texto.trim() || carregando) return;

    const historico = [
      ...mensagens,
      { role: "user", content: texto.trim() }
    ];

    setMensagens(historico);
    setTexto("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historico,
          idioma,
          nivel
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || "Não consegui responder.");
      }

      setMensagens([
        ...historico,
        { role: "assistant", content: dados.resposta }
      ]);
    } catch (erro) {
      setMensagens([
        ...historico,
        {
          role: "assistant",
          content: erro.message
        }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="pagina">
      <section className="chat">
        <header className="cabecalho">
          <div className="logo">onelingo<span>.</span></div>
          <h1>Pratique com o Zói!</h1>
          <p>Aprenda idiomas conversando, sem medo de errar.</p>

          <div className="opcoes">
            <label>
              Idioma
              <select value={idioma} onChange={e => setIdioma(e.target.value)}>
                <option>Inglês</option>
                <option>Espanhol</option>
                <option>Francês</option>
                <option>Alemão</option>
                <option>Italiano</option>
              </select>
            </label>

            <label>
              Nível
              <select value={nivel} onChange={e => setNivel(e.target.value)}>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </label>
          </div>
        </header>

        <div className="conversa">
          {mensagens.map((m, i) => (
            <div className={`mensagem ${m.role}`} key={i}>
              <strong>{m.role === "user" ? "Você" : "Zói"}</strong>
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

        <form className="entrada" onSubmit={enviar}>
          <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escreva sua mensagem..."
            disabled={carregando}
          />
          <button disabled={carregando || !texto.trim()}>
            Enviar ↑
          </button>
        </form>

        <footer>Onelingo · Aprenda conversando</footer>
      </section>
    </main>
  );
}
