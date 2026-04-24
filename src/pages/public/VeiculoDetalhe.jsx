import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import CarCard from "../../components/CarCard";
import VehicleDetailInfoList from "../../components/vehicle/VehicleDetailInfoList";
import VehicleDetailState from "../../components/vehicle/VehicleDetailState";
import {
  CalendarCardIcon,
  CarSilhouetteIcon,
  FuelPumpIcon,
  MileageIcon,
  MessageCardIcon,
  PowerGaugeIcon,
  ShieldCheckIcon,
  TransmissionIcon,
} from "../../components/icons/CommonIcons";
import TypedIcon from "../../components/icons/TypedIcon";
import { buildVehicleDetailRows } from "../../data/vehicleDetail";
import SitePage from "../../components/SitePage";
import { formatEuro } from "../../utils/format";
import { buildUniqueVehicleText } from "../../utils/vehicle";
import useVehicles from "../../hooks/useVehicles";
import { getRelatedVehicles, getVehicleBySlug } from "../../utils/vehicleMeta";
const detailIcons = {
  combustivel: FuelPumpIcon,
  garantia: ShieldCheckIcon,
  potencia: PowerGaugeIcon,
  quilometros: MileageIcon,
  registo: CalendarCardIcon,
  tipo: CarSilhouetteIcon,
  transmissao: TransmissionIcon,
  versao: MessageCardIcon,
};

function VehicleDetailPage() {
  const { slug } = useParams();
  const { vehicles, isLoading, error } = useVehicles();
  const vehicle = getVehicleBySlug(vehicles, slug);
  const relatedVehicles = useMemo(
    () => getRelatedVehicles(vehicles, vehicle, 3),
    [vehicle, vehicles],
  );

  if (isLoading) {
    return <VehicleDetailState title="A carregar viatura..." />;
  }

  if (error) {
    return (
      <VehicleDetailState
        title="Erro ao carregar a viatura"
        error={error}
      />
    );
  }

  if (!vehicle) {
    return (
      <VehicleDetailState
        title="Viatura não encontrada"
        description="A viatura que procurou pode já não estar disponível ou o link não estar correto."
      />
    );
  }

  const formattedPrice = formatEuro(vehicle.preco);
  const detailRows = buildVehicleDetailRows(vehicle);
  const heading = buildUniqueVehicleText(
    vehicle.title,
    vehicle.versao,
    vehicle.potencia,
  );
  const captionTitle = buildUniqueVehicleText(vehicle.title, vehicle.versao);
  const captionSubtitle = [vehicle.caixa, vehicle.combustivel]
    .filter(Boolean)
    .join(" | ");
  const captionMetaItems = [
    vehicle.ano ? `Ano ${vehicle.ano}` : null,
    vehicle.quilometragem ? vehicle.quilometragem : null,
  ].filter(Boolean);

  return (
    <SitePage mainClassName="page-shell vehicle-detail-page">
      <nav className="vehicle-detail__breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
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

          <VehicleDetailInfoList
            rows={detailRows}
            renderIcon={(type) => (
              <TypedIcon
                type={type}
                icons={detailIcons}
                fallback={ShieldCheckIcon}
              />
            )}
          />

          <Link className="vehicle-detail__cta" to={vehicle.testDrivePath}>
            Teste Drive
          </Link>
        </aside>

        <section className="vehicle-detail__gallery">
          <div className="vehicle-detail__image-frame">
            <img src={vehicle.imagem} alt={vehicle.title} />
          </div>

          <div className="vehicle-detail__image-caption">
            <p className="vehicle-detail__image-kicker">{vehicle.sourceLabel}</p>
            <strong>{captionTitle}</strong>
            {captionSubtitle ? (
              <span className="vehicle-detail__image-subtitle">
                {captionSubtitle}
              </span>
            ) : null}
            {captionMetaItems.length > 0 ? (
              <div className="vehicle-detail__image-meta-list">
                {captionMetaItems.map((item) => (
                  <span className="vehicle-detail__image-meta-item" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </section>

      {relatedVehicles.length > 0 ? (
        <section className="vehicle-detail__related">
          <div className="vehicle-detail__related-heading">
            <p className="vehicle-detail__section-kicker">Mais opções</p>
            <h2>Outras viaturas que podem interessar</h2>
          </div>

          <div className="catalog-grid vehicle-detail__related-grid">
            {relatedVehicles.map((relatedVehicle) => (
              <CarCard key={relatedVehicle.slug} car={relatedVehicle} />
            ))}
          </div>
        </section>
      ) : null}
    </SitePage>
  );
}

export default VehicleDetailPage;
