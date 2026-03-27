import { useState } from "react";
import CustomSelect from "./form/CustomSelect";
import { SearchIcon } from "./icons/CommonIcons";

function SearchSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}) {
  return (
    <div className="vehicle-search__field">
      <span className="vehicle-search__label">{label}</span>
      <CustomSelect
        value={value}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        rootClassName={`vehicle-search__select${disabled ? " is-disabled" : ""}`}
        triggerClassName="vehicle-search__select-trigger"
        menuClassName="vehicle-search__select-menu"
        optionClassName="vehicle-search__select-option"
      />
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
