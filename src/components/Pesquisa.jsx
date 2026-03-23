import { useState } from "react";

function Pesquisa() {
  const [texto, setTexto] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="pesquisa" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pesquisar viaturas..."
        aria-label="Pesquisar viaturas"
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
      />
      <button type="submit">Pesquisar</button>
    </form>
  );
}

export default Pesquisa;
