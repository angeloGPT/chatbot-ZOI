
"use client";

import { useEffect, useRef, useState } from "react";

import Cabecalho from "./components/Cabecalho";
import OpcoesIdioma from "./components/OpcoesIdioma";
import Conversa from "./components/Conversa";
import EntradaMensagem from "./components/EntradaMensagem";

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: historico,
          idioma,
          nivel
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não consegui responder."
        );
      }

      setMensagens([
        ...historico,
        {
          role: "assistant",
          content: dados.resposta
        }
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
        <Cabecalho />

        <OpcoesIdioma
          idioma={idioma}
          setIdioma={setIdioma}
          nivel={nivel}
          setNivel={setNivel}
        />

        <Conversa
          mensagens={mensagens}
          carregando={carregando}
          fim={fim}
        />

        <EntradaMensagem
          texto={texto}
          setTexto={setTexto}
          enviar={enviar}
          carregando={carregando}
        />

        <footer>
          Onelingo · Aprenda conversando
        </footer>
      </section>
    </main>
  );
}
