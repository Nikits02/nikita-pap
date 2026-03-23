import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import {
  getRelatedVehicles,
  getVehicleBySlug,
} from "../data/vehicleInventory";

const priceFormatter = new Intl.NumberFormat("pt-PT");

function DetailIcon({ type }) {
  if (type === "registo") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5v3M17 4.5v3" />
        <rect x="4.5" y="6.5" width="15" height="13" rx="1.5" />
        <path d="M4.5 10h15" />
      </svg>
    );
  }

  if (type === "quilometros") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 18.5a8 8 0 1 1 11 0" />
        <path d="M12 12l4-3" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "versao") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 6.5h10a2.5 2.5 0 0 1 2.5 2.5v5.2a2.5 2.5 0 0 1-2.5 2.5h-4.6L8 20v-3.3H7a2.5 2.5 0 0 1-2.5-2.5V9A2.5 2.5 0 0 1 7 6.5Z" />
        <path d="M8.5 10.2h7" />
        <path d="M8.5 13.4h5.2" />
      </svg>
    );
  }

  if (type === "potencia") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.8 17.2a7.4 7.4 0 1 1 10.4 0" />
        <path d="M12 12l4.2-4.2" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "combustivel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 5.5h6v13h-6z" />
        <path d="M13.5 8.2h1.8l1.7 1.9v6.6a1.3 1.3 0 0 1-1.3 1.3h-.4" />
        <path d="M15.3 7V4.8" />
      </svg>
    );
  }

  if (type === "transmissao") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="7" r="1.5" />
        <circle cx="16" cy="7" r="1.5" />
        <circle cx="8" cy="16" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
        <path d="M8 8.5v6" />
        <path d="M16 8.5v6" />
        <path d="M8 11.5h8" />
      </svg>
    );
  }

  if (type === "tipo") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 15.5h12l1.2-3.2a1.4 1.4 0 0 0-1.3-1.9H7.1a1.4 1.4 0 0 0-1.3.9L4.6 15.5H6Z" />
        <path d="M5.5 15.5h13a1 1 0 0 1 1 1v1h-2v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2H9v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2h-2v-1a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.2 17 6v4.7c0 3.5-1.9 6-5 7.6-3.1-1.6-5-4.1-5-7.6V6l5-1.8Z" />
      <path d="m9.4 12.1 1.8 1.8 3.8-4" />
    </svg>
  );
}

function buildDetailRows(vehicle) {
  return [
    {
      type: "registo",
      label: "Registo",
      value: vehicle.ano ? String(vehicle.ano) : "Sob consulta",
    },
    {
      type: "quilometros",
      label: "Quilometragem",
      value: vehicle.quilometragem ?? "Sob consulta",
    },
    {
      type: "versao",
      label: "Versao",
      value: vehicle.versao ?? "Sob consulta",
    },
    {
      type: "potencia",
      label: "Potencia",
      value: vehicle.potencia ?? "Sob consulta",
    },
    {
      type: "combustivel",
      label: "Combustivel",
      value: vehicle.combustivel ?? "Sob consulta",
    },
    {
      type: "transmissao",
      label: "Transmissao",
      value: vehicle.caixa ?? "Sob consulta",
    },
    {
      type: "tipo",
      label: "Tipo",
      value: vehicle.tipo ?? vehicle.typeLabel ?? "Viatura",
    },
    {
      type: "garantia",
      label: "Disponibilidade",
      value: vehicle.source === "highlight" ? "Destaque em loja" : "Em stock",
    },
  ];
}

function VehicleDetailPage() {
  const { slug } = useParams();
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    return (
      <>
        <Navbar />

        <main className="page-shell vehicle-detail-page">
          <section className="vehicle-detail__missing">
            <p className="vehicle-detail__hero-kicker">NikitaMotors</p>
            <h1>Viatura nao encontrada</h1>
            <p>
              A viatura que procurou pode ja nao estar disponivel ou o link nao
              estar correto.
            </p>
            <Link className="vehicle-detail__cta" to="/catalogo">
              Voltar ao Catalogo
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const relatedVehicles = getRelatedVehicles(vehicle, 3);
  const formattedPrice = priceFormatter.format(vehicle.preco).replace(/\u00A0/g, " ");
  const detailRows = buildDetailRows(vehicle);
  const heading = `${vehicle.title} ${vehicle.versao ?? ""} ${vehicle.potencia ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
  const captionTitle = [vehicle.title, vehicle.versao].filter(Boolean).join(" ");
  const captionSubtitle = [vehicle.caixa, vehicle.combustivel].filter(Boolean).join(" | ");
  const captionMeta = [
    vehicle.ano ? `Ano: ${vehicle.ano}` : null,
    vehicle.quilometragem ? `KMS: ${vehicle.quilometragem}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <>
      <Navbar />

      <main className="page-shell vehicle-detail-page">
        <nav className="vehicle-detail__breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Catalogo</Link>
          <span>/</span>
          <span>{vehicle.title}</span>
        </nav>

        <header className="vehicle-detail__header">
          <p className="vehicle-detail__hero-kicker">{vehicle.sourceLabel}</p>
          <h1>{heading}</h1>
        </header>

        <section className="vehicle-detail__showcase">
          <aside className="vehicle-detail__sidebar">
            <div className="vehicle-detail__price-tag">PVP: {formattedPrice} EUR</div>

            <div className="vehicle-detail__info-list">
              {detailRows.map((item) => (
                <div className="vehicle-detail__info-row" key={item.label}>
                  <div className="vehicle-detail__info-icon">
                    <DetailIcon type={item.type} />
                  </div>
                  <span className="vehicle-detail__info-label">{item.label}</span>
                  <strong className="vehicle-detail__info-value">{item.value}</strong>
                </div>
              ))}
            </div>

            <Link className="vehicle-detail__cta" to={vehicle.testDrivePath}>
              Teste Drive
            </Link>
          </aside>

          <section className="vehicle-detail__gallery">
            <div className="vehicle-detail__image-frame">
              <img src={vehicle.imagem} alt={vehicle.title} />
            </div>

            <div className="vehicle-detail__image-caption">
              <strong>{captionTitle}</strong>
              {captionSubtitle ? (
                <span className="vehicle-detail__image-subtitle">{captionSubtitle}</span>
              ) : null}
              {captionMeta ? (
                <span className="vehicle-detail__image-meta">{captionMeta}</span>
              ) : null}
            </div>
          </section>
        </section>

        {relatedVehicles.length > 0 ? (
          <section className="vehicle-detail__related">
            <div className="vehicle-detail__related-heading">
              <p className="vehicle-detail__section-kicker">Mais opcoes</p>
              <h2>Outras viaturas que podem interessar</h2>
            </div>

            <div className="catalog-grid vehicle-detail__related-grid">
              {relatedVehicles.map((relatedVehicle) => (
                <CarCard
                  key={relatedVehicle.slug}
                  car={relatedVehicle}
                  source={relatedVehicle.source}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}

export default VehicleDetailPage;
