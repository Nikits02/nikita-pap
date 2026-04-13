import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import CustomSelect from "../components/form/CustomSelect";
import { SortAdjustIcon } from "../components/icons/CommonIcons";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import { catalogOrderOptions } from "../data/catalog";
import useVehicles from "../hooks/useVehicles";
import {
  filterAndSortVehicles,
  getCatalogFiltersFromSearchParams,
  updateCatalogFilters,
} from "../utils/catalog";

function Catalogo() {
  const [searchParams] = useSearchParams();
  const { vehicles, isLoading, error } = useVehicles();
  const [filters, setFilters] = useState(() =>
    getCatalogFiltersFromSearchParams(searchParams),
  );

  const marcas = useMemo(
    () => [...new Set(vehicles.map((car) => car.marca))].sort(),
    [vehicles],
  );

  useEffect(() => {
    setFilters(getCatalogFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  function updateField(field, value) {
    setFilters((current) => updateCatalogFilters(current, field, value));
  }

  const filteredCars = useMemo(
    () => filterAndSortVehicles(vehicles, filters),
    [filters, vehicles],
  );

  return (
    <SitePage mainClassName="page-shell catalog-page">
      <PageHero
        className="catalog-page__hero"
        title="Catalogo"
        description="Explore a nossa selecao exclusiva de veiculos premium"
      />

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
          <SortAdjustIcon />
          <span>Ordenar por</span>
          <CustomSelect
            value={filters.ordem}
            options={catalogOrderOptions}
            onChange={(value) => updateField("ordem", value)}
            rootClassName="catalog-order__field catalog-order__field--custom"
            triggerClassName="catalog-order__trigger"
            menuClassName="catalog-order__menu"
            optionClassName="catalog-order__option"
          />
        </label>
      </section>

      <div className="catalog-page__divider" />

      <p className="catalog-page__count">
        {isLoading
          ? "A carregar viaturas..."
          : `${filteredCars.length} veiculos encontrados`}
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
            <CarCard
              key={car.slug ?? `${car.marca}-${car.modelo}-${car.id}`}
              car={car}
            />
          ))
        ) : (
          <div className="empty-results">
            <h3>Sem resultados para os filtros aplicados.</h3>
            <p>Tente mudar os criterios para ver mais opcoes no catalogo.a</p>
          </div>
        )}
      </section>
    </SitePage>
  );
}

export default Catalogo;
