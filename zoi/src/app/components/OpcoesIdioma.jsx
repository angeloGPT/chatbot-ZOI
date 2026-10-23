
export default function OpcoesIdioma({
  idioma,
  setIdioma,
  nivel,
  setNivel
}) {
  return (
    <div className="opcoes">
      <label>
        Idioma
        <select
          value={idioma}
          onChange={e => setIdioma(e.target.value)}
        >
          <option>Inglês</option>
          <option>Espanhol</option>
          <option>Francês</option>
          <option>Alemão</option>
          <option>Italiano</option>
        </select>
      </label>

      <label>
        Nível
        <select
          value={nivel}
          onChange={e => setNivel(e.target.value)}
        >
          <option>Iniciante</option>
          <option>Intermediário</option>
          <option>Avançado</option>
        </select>
      </label>
    </div>
  );
}
