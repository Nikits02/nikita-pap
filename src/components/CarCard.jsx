import { Link } from "react-router-dom";
import { getVehicleDetailPath } from "../utils/vehicleMeta";

const priceFormatter = new Intl.NumberFormat("pt-PT");

function CarCard({ car }) {
  const formattedPrice = priceFormatter.format(car.preco).replace(/\u00A0/g, " ");
  const detailPath = car.detailPath ?? getVehicleDetailPath(car);
  const powerLabel = car.potencia ?? "Sob consulta";

  return (
    <Link
      className="catalog-card"
      to={detailPath}
      aria-label={`Ver detalhes de ${car.marca} ${car.modelo}`}
    >
      <div className="catalog-card__media">
        <img src={car.imagem} alt={`${car.marca} ${car.modelo}`} />
        {car.novidade ? <span className="catalog-card__badge">Novo</span> : null}
      </div>

      <div className="catalog-card__body">
        <p className="catalog-card__brand">{car.marca}</p>
        <h3>{car.modelo}</h3>

        <div className="catalog-card__meta">
          <div className="catalog-card__meta-item">
            <span className="catalog-card__meta-label">Ano</span>
            <strong>{car.ano}</strong>
          </div>

          <div className="catalog-card__meta-item">
            <span className="catalog-card__meta-label">Potencia</span>
            <strong>{powerLabel}</strong>
          </div>

          <div className="catalog-card__meta-item">
            <span className="catalog-card__meta-label">Combustivel</span>
            <strong>{car.combustivel}</strong>
          </div>
        </div>

        <div className="catalog-card__footer">
          <div className="catalog-card__price-block">
            <span className="catalog-card__price-prefix">A partir de</span>
            <p className="catalog-card__price-value">
              {formattedPrice} <span>EUR</span>
            </p>
          </div>

          <div className="catalog-card__cta-group">
            <span className="catalog-card__cta-link">Ver Detalhes</span>
            <span className="catalog-card__cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 12h12" />
                <path d="m13 7 5 5-5 5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;
