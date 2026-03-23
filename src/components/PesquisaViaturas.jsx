import { useEffect, useRef, useState } from "react";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 4a6.5 6.5 0 1 0 4 11.6l4.5 4.5 1.4-1.4-4.5-4.5A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function SearchSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedLabel = value || placeholder;

  function selectOption(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className="vehicle-search__field">
      <span className="vehicle-search__label">{label}</span>

      <div
        className={`vehicle-search__select${disabled ? " is-disabled" : ""}`}
        ref={rootRef}
      >
        <button
          className={`vehicle-search__select-trigger${isOpen ? " is-open" : ""}${!value ? " is-placeholder" : ""}`}
          type="button"
          onClick={() => !disabled && setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span>{selectedLabel}</span>
          <ChevronIcon />
        </button>

        {isOpen && !disabled ? (
          <div className="vehicle-search__select-menu" role="listbox">
            {options.map((option) => (
              <button
                className={`vehicle-search__select-option${value === option ? " is-active" : ""}`}
                key={option}
                type="button"
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PesquisaViaturas({ cars, initialFilters, onSearch }) {
  const marcas = [...new Set(cars.map((car) => car.marca))].sort();

  const [filtrosLocais, setFiltrosLocais] = useState(initialFilters);

  const baseCars = cars.filter((car) => {
    if (filtrosLocais.marca && car.marca !== filtrosLocais.marca) {
      return false;
    }

    if (filtrosLocais.modelo && car.modelo !== filtrosLocais.modelo) {
      return false;
    }

    return true;
  });

  const modelos = [
    ...new Set(
      cars
        .filter((car) =>
          filtrosLocais.marca ? car.marca === filtrosLocais.marca : true,
        )
        .map((car) => car.modelo),
    ),
  ].sort();

  const combustiveis = [...new Set(baseCars.map((car) => car.combustivel))].sort();
  const caixas = [...new Set(baseCars.map((car) => car.caixa))].sort();

  function atualizarCampo(campo, valor) {
    setFiltrosLocais((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function mudarMarca(valor) {
    setFiltrosLocais((atual) => ({
      ...atual,
      marca: valor,
      modelo: "",
      combustivel: "",
      caixa: "",
    }));
  }

  function mudarModelo(valor) {
    setFiltrosLocais((atual) => ({
      ...atual,
      modelo: valor,
      combustivel: "",
      caixa: "",
    }));
  }

  function submeterPesquisa(event) {
    event.preventDefault();
    onSearch(filtrosLocais);
  }

  return (
    <section className="vehicle-search" aria-labelledby="pesquisa-viaturas">
      <div className="vehicle-search__panel">
        <h2 id="pesquisa-viaturas">Pesquise aqui a sua viatura!</h2>

        <form className="vehicle-search__form" onSubmit={submeterPesquisa}>
          <div className="vehicle-search__selectors">
            <SearchSelect
              label="Marca"
              value={filtrosLocais.marca}
              placeholder="Marcas"
              options={marcas}
              onChange={mudarMarca}
            />

            <SearchSelect
              label="Modelo"
              value={filtrosLocais.modelo}
              placeholder="Modelo"
              options={modelos}
              onChange={mudarModelo}
              disabled={modelos.length === 0}
            />

            <SearchSelect
              label="Combustivel"
              value={filtrosLocais.combustivel}
              placeholder="Combustivel"
              options={combustiveis}
              onChange={(valor) => atualizarCampo("combustivel", valor)}
              disabled={combustiveis.length === 0}
            />

            <SearchSelect
              label="Caixa"
              value={filtrosLocais.caixa}
              placeholder="Manual / Automatica"
              options={caixas}
              onChange={(valor) => atualizarCampo("caixa", valor)}
              disabled={caixas.length === 0}
            />

            <div className="vehicle-search__actions">
              <button className="vehicle-search__button" type="submit">
                <span>Pesquisar</span>
                <SearchIcon />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PesquisaViaturas;
