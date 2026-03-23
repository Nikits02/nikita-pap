import { Link } from "react-router-dom";
import { getVehicleDetailPath } from "../data/vehicleInventory";

const priceFormatter = new Intl.NumberFormat("pt-PT");

function UltimasViaturas({ cars }) {
  const latestCars = [...cars]
    .sort((a, b) => new Date(b.insertedAt) - new Date(a.insertedAt))
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
                key={car.id}
                to={getVehicleDetailPath(car, "stock")}
                aria-label={`Ver detalhes de ${car.marca} ${car.modelo}`}
              >
                <div className="highlight-card__media">
                  <img src={car.imagem} alt={`${car.marca} ${car.modelo}`} />
                  {car.novidade ? <span className="highlight-card__badge">Novo</span> : null}
                </div>

                <div className="highlight-card__body">
                  <p className="highlight-card__brand">{car.marca}</p>
                  <h3>{car.modelo}</h3>
                  <p className="highlight-card__price">
                    {priceFormatter.format(car.preco)} EUR
                  </p>
                  <span className="highlight-card__cta">
                    Ver Detalhes
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="latest-vehicles__cta-wrap">
            <Link className="latest-vehicles__cta" to="/catalogo">
              Ver todo stock
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
