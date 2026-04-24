import { Link } from "react-router-dom";
import { formatEuro } from "../utils/format";
import { getVehicleLabel } from "../utils/vehicle";
import { getVehicleDetailPath } from "../utils/vehicleMeta";

const MAX_LATEST_VEHICLES = 6;

function getInsertedTimestamp(car) {
  const parsedDate = new Date(car.insertedAt ?? car.inserted_at ?? 0);
  const timestamp = parsedDate.getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getLatestVehicles(cars) {
  return [...cars]
    .sort((a, b) => {
      const insertedDiff = getInsertedTimestamp(b) - getInsertedTimestamp(a);

      if (insertedDiff !== 0) {
        return insertedDiff;
      }

      return Number(b.id ?? 0) - Number(a.id ?? 0);
    })
    .slice(0, MAX_LATEST_VEHICLES);
}

function UltimasViaturas({ cars }) {
  const latestCars = getLatestVehicles(cars);

  return (
    <section className="latest-vehicles" aria-labelledby="ultimas-viaturas">
      <h2 className="latest-vehicles__title" id="ultimas-viaturas">
        Últimas Viaturas Inseridas
      </h2>

      {latestCars.length > 0 ? (
        <>
          <div className="latest-vehicles__grid">
            {latestCars.map((car) => {
              const vehicleLabel = getVehicleLabel(car);

              return (
                <Link
                  className="latest-card highlight-card"
                  key={car.slug ?? car.id}
                  to={getVehicleDetailPath(car, "catalog")}
                  aria-label={`Ver detalhes de ${vehicleLabel}`}
                >
                  <div className="highlight-card__media">
                    <img src={car.imagem} alt={vehicleLabel} />
                    {car.novidade ? (
                      <span className="catalog-card__badge">Novo</span>
                    ) : null}
                  </div>

                  <div className="highlight-card__body latest-card__body">
                    <p className="latest-card__brand">{car.marca}</p>
                    <h3 className="latest-card__title">{car.modelo}</h3>
                    <p className="latest-card__price">
                      {formatEuro(car.preco)} EUR
                    </p>
                    <span className="highlight-card__cta latest-card__cta">
                      Ver Detalhes
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="latest-vehicles__cta-wrap">
            <Link className="latest-vehicles__cta" to="/catalogo">
              Ver todo catálogo
            </Link>
          </div>
        </>
      ) : (
        <div className="latest-vehicles__empty">
          <h3>Sem viaturas para os filtros escolhidos</h3>
          <p>Experimenta ajustar a marca, modelo, combustível, ano ou preço.</p>
        </div>
      )}
    </section>
  );
}

export default UltimasViaturas;
