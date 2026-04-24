import { useCallback, useEffect, useMemo, useState } from "react";
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
        allowDeselect
        disabled={disabled}
        rootClassName={`vehicle-search__select${disabled ? " is-disabled" : ""}`}
        triggerClassName="vehicle-search__select-trigger"
        menuClassName="vehicle-search__select-menu"
        optionClassName="vehicle-search__select-option"
      />
    </div>
  );
}

function getUniqueOptions(cars, field) {
  return [...new Set(cars.map((car) => car[field]).filter(Boolean))].sort();
}

function PesquisaViaturas({ cars, initialFilters, onSearch }) {
  const [filtrosLocais, setFiltrosLocais] = useState(initialFilters);

  useEffect(() => {
    setFiltrosLocais(initialFilters);
  }, [initialFilters]);

  const getFilteredCars = useCallback(
    (excludedField = "") =>
      cars.filter((car) => {
        if (
          excludedField !== "marca" &&
          filtrosLocais.marca &&
          car.marca !== filtrosLocais.marca
        ) {
          return false;
        }

        if (
          excludedField !== "modelo" &&
          filtrosLocais.modelo &&
          car.modelo !== filtrosLocais.modelo
        ) {
          return false;
        }

        if (
          excludedField !== "combustivel" &&
          filtrosLocais.combustivel &&
          car.combustivel !== filtrosLocais.combustivel
        ) {
          return false;
        }

        if (
          excludedField !== "caixa" &&
          filtrosLocais.caixa &&
          car.caixa !== filtrosLocais.caixa
        ) {
          return false;
        }

        return true;
      }),
    [cars, filtrosLocais],
  );

  const marcas = useMemo(() => getUniqueOptions(cars, "marca"), [cars]);

  const modelos = useMemo(
    () => getUniqueOptions(getFilteredCars("modelo"), "modelo"),
    [getFilteredCars],
  );

  const combustiveis = useMemo(
    () => getUniqueOptions(getFilteredCars("combustivel"), "combustivel"),
    [getFilteredCars],
  );

  const caixas = useMemo(
    () => getUniqueOptions(getFilteredCars("caixa"), "caixa"),
    [getFilteredCars],
  );

  const marcasCompativeis = useMemo(
    () => getUniqueOptions(getFilteredCars("marca"), "marca"),
    [getFilteredCars],
  );

  useEffect(() => {
    setFiltrosLocais((atual) => {
      const nextFilters = { ...atual };
      let changed = false;

      if (nextFilters.marca && !marcas.includes(nextFilters.marca)) {
        nextFilters.marca = "";
        changed = true;
      }

      if (nextFilters.modelo && !modelos.includes(nextFilters.modelo)) {
        nextFilters.modelo = "";
        changed = true;
      }

      if (
        nextFilters.combustivel &&
        !combustiveis.includes(nextFilters.combustivel)
      ) {
        nextFilters.combustivel = "";
        changed = true;
      }

      if (nextFilters.caixa && !caixas.includes(nextFilters.caixa)) {
        nextFilters.caixa = "";
        changed = true;
      }

      return changed ? nextFilters : atual;
    });
  }, [marcas, modelos, combustiveis, caixas]);

  useEffect(() => {
    setFiltrosLocais((atual) => {
      if (!atual.modelo) {
        return atual;
      }

      if (atual.marca && marcasCompativeis.includes(atual.marca)) {
        return atual;
      }

      if (marcasCompativeis.length !== 1) {
        return atual;
      }

      return {
        ...atual,
        marca: marcasCompativeis[0],
      };
    });
  }, [marcasCompativeis]);

  function atualizarCampo(campo, valor) {
    setFiltrosLocais((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function mudarMarca(valor) {
    setFiltrosLocais((atual) => {
      if (!valor) {
        return {
          ...atual,
          marca: "",
          modelo: "",
          combustivel: "",
          caixa: "",
        };
      }

      return {
        ...atual,
        marca: valor,
      };
    });
  }

  function mudarModelo(valor) {
    setFiltrosLocais((atual) => ({
      ...atual,
      modelo: valor,
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
              placeholder="Manual / Automática"
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
