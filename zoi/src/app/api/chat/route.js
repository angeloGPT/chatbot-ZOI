
import OpenAI from "openai";

export async function POST(request) {
  try {
    const { messages, idioma, nivel } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Envie uma mensagem para começar." },
        { status: 400 }
      );
    }

    const historico = messages
      .filter(m =>
        ["user", "assistant"].includes(m.role) &&
        typeof m.content === "string"
      )
      .slice(-12)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 2000)
      }));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const resposta = await openai.responses.create({
      model: "gpt-4o-mini",

      instructions: `
        Você é Zói, o agente de conversação da Onelingo.

        Seu objetivo é ajudar o usuário a praticar idiomas.

        Idioma: ${idioma}.
        Nível: ${nivel}.

        Regras:
        - Converse principalmente no idioma escolhido.
        - Adapte o vocabulário ao nível do usuário.
        - Faça perguntas para manter a conversa.
        - Corrija erros importantes de gramática e vocabulário.
        - Explique as correções brevemente em português.
        - Sugira palavras e expressões novas.
        - Seja amigável, divertido e paciente.
        - Não humilhe o usuário por cometer erros.
      `,

      input: historico
    });

    return Response.json({
      resposta: resposta.output_text
    });

} catch (erro) {
  console.error("Erro na API do Zói:", erro);

  return Response.json(
    {
      error: erro.message || "Erro desconhecido na API."
    },
    { status: 500 }
  );
}

}
