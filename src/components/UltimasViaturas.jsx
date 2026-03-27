import { Link } from "react-router-dom";
import { formatEuro } from "../utils/format";
import { getVehicleLabel } from "../utils/vehicle";
import { getVehicleDetailPath } from "../utils/vehicleMeta";

function getInsertedTimestamp(car) {
  const parsedDate = new Date(car.insertedAt ?? car.inserted_at ?? 0);
  const timestamp = parsedDate.getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function UltimasViaturas({ cars }) {
  const latestCars = [...cars]
    .sort((a, b) => {
      const insertedDiff = getInsertedTimestamp(b) - getInsertedTimestamp(a);

      if (insertedDiff !== 0) {
        return insertedDiff;
      }

      return Number(b.id ?? 0) - Number(a.id ?? 0);
    })
    .slice(0, 6);

  return (
    <section className="latest-vehicles" aria-labelledby="ultimas-viaturas">
      <h2 className="latest-vehicles__title" id="ultimas-viaturas">
        Ultimas Viaturas Inseridas
      </h2>

      {latestCars.length > 0 ? (
        <>
          <div className="latest-vehicles__grid">
            {latestCars.map((car) => (
              <Link
                className="latest-card highlight-card"
                key={car.slug ?? car.id}
                to={getVehicleDetailPath(car, "catalog")}
                aria-label={`Ver detalhes de ${getVehicleLabel(car)}`}
              >
                <div className="highlight-card__media">
                  <img src={car.imagem} alt={getVehicleLabel(car)} />
                  {car.novidade ? <span className="highlight-card__badge">Novo</span> : null}
                </div>

                <div className="highlight-card__body latest-card__body">
                  <p className="latest-card__brand">{car.marca}</p>
                  <h3 className="latest-card__title">
                    {car.modelo}
                  </h3>
                  <p className="latest-card__price">
                    {formatEuro(car.preco)} EUR
                  </p>
                  <span className="highlight-card__cta latest-card__cta">
                    Ver Detalhes
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="latest-vehicles__cta-wrap">
            <Link className="latest-vehicles__cta" to="/catalogo">
              Ver todo catalogo
            </Link>
          </div>
        </>
      ) : (
        <div className="latest-vehicles__empty">
          <h3>Sem viaturas para os filtros escolhidos</h3>
          <p>Experimenta ajustar a marca, modelo, combustivel, ano ou preco.</p>
        </div>
      )}
    </section>
  );
}

export default UltimasViaturas;
