import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import useVehicles from "../hooks/useVehicles";

function getFiltersFromSearchParams(searchParams) {
  return {
    marca: searchParams.get("marca") ?? "",
    modelo: searchParams.get("modelo") ?? "",
    combustivel: searchParams.get("combustivel") ?? "",
    caixa: searchParams.get("caixa") ?? "",
    ordem: searchParams.get("ordem") ?? "recentes",
  };
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12" />
      <path d="M9 12h9" />
      <path d="M12 17h6" />
      <circle cx="8" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="17" r="1.2" fill="currentColor" stroke="none" />
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

function CatalogOrderSelect({ value, options, onChange }) {
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

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  function selectOption(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className="catalog-order__field catalog-order__field--custom" ref={rootRef}>
      <button
        className={`catalog-order__trigger${isOpen ? " is-open" : ""}`}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption.label}</span>
        <ChevronIcon />
      </button>

      {isOpen ? (
        <div className="catalog-order__menu" role="listbox">
          {options.map((option) => (
            <button
              className={`catalog-order__option${value === option.value ? " is-active" : ""}`}
              key={option.value}
              type="button"
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Catalogo() {
  const [searchParams] = useSearchParams();
  const { vehicles, isLoading, error } = useVehicles();
  const [filters, setFilters] = useState(() => getFiltersFromSearchParams(searchParams));
  const orderOptions = [
    { value: "recentes", label: "Mais recentes" },
    { value: "preco-asc", label: "Preco ascendente" },
    { value: "preco-desc", label: "Preco descendente" },
  ];

  const marcas = useMemo(
    () => [...new Set(vehicles.map((car) => car.marca))].sort(),
    [vehicles],
  );

  useEffect(() => {
    setFilters(getFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  function updateField(field, value) {
    setFilters((current) => {
      if (field === "marca") {
        return {
          ...current,
          marca: value,
          modelo: "",
          combustivel: "",
          caixa: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  const filteredCars = useMemo(() => {
    const filtered = vehicles.filter((car) => {
      if (filters.marca && car.marca !== filters.marca) {
        return false;
      }

      if (filters.modelo && car.modelo !== filters.modelo) {
        return false;
      }

      if (filters.combustivel && car.combustivel !== filters.combustivel) {
        return false;
      }

      if (filters.caixa && car.caixa !== filters.caixa) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstCar, secondCar) => {
      if (filters.ordem === "preco-asc") {
        return firstCar.preco - secondCar.preco;
      }

      if (filters.ordem === "preco-desc") {
        return secondCar.preco - firstCar.preco;
      }

      const firstInsertedAt = firstCar.insertedAt
        ? new Date(firstCar.insertedAt).getTime()
        : 0;
      const secondInsertedAt = secondCar.insertedAt
        ? new Date(secondCar.insertedAt).getTime()
        : 0;

      return secondInsertedAt - firstInsertedAt;
    });
  }, [filters, vehicles]);

  return (
    <>
      <Navbar />

      <main className="page-shell catalog-page">
        <section className="catalog-page__hero">
          <p className="catalog-page__eyebrow">NIKITAMOTORS</p>
          <h1>Catalogo</h1>
          <p>Explore a nossa selecao exclusiva de veiculos premium</p>
        </section>

        <div className="catalog-page__divider" />

        <section className="catalog-filters">
          <div className="catalog-filters__groups">
            <div className="catalog-filter-group">
              <button
                className={`catalog-filter-tab${filters.marca === "" ? " is-active" : ""}`}
                type="button"
                onClick={() => updateField("marca", "")}
              >
                Todos
              </button>

              {marcas.map((marca) => (
                <button
                  className={`catalog-filter-tab${filters.marca === marca ? " is-active" : ""}`}
                  key={marca}
                  type="button"
                  onClick={() => updateField("marca", marca)}
                >
                  {marca}
                </button>
              ))}
            </div>
          </div>

          <label className="catalog-order">
            <SortIcon />
            <span>Ordenar por</span>
            <CatalogOrderSelect
              value={filters.ordem}
              options={orderOptions}
              onChange={(value) => updateField("ordem", value)}
            />
          </label>
        </section>

        <div className="catalog-page__divider" />

        <p className="catalog-page__count">
          {isLoading ? "A carregar viaturas..." : `${filteredCars.length} veiculos encontrados`}
        </p>

        <section className="catalog-grid">
          {isLoading ? (
            <div className="empty-results">
              <h3>A carregar viaturas...</h3>
            </div>
          ) : error ? (
            <div className="empty-results">
              <h3>Nao foi possivel carregar o catalogo.</h3>
              <p>{error}</p>
            </div>
          ) : filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <CarCard key={car.slug ?? `${car.marca}-${car.modelo}-${car.id}`} car={car} />
            ))
          ) : (
            <div className="empty-results">
              <h3>Sem resultados para os filtros aplicados.</h3>
              <p>Tente mudar os criterios para ver mais opcoes no catalogo.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Catalogo;
