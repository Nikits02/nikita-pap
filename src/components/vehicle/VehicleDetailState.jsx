import { Link } from "react-router-dom";
import SitePage from "../SitePage";

function VehicleDetailState({ title, description, error }) {
  return (
    <SitePage mainClassName="page-shell vehicle-detail-page">
      <section className="vehicle-detail__missing">
        <p className="vehicle-detail__hero-kicker">NikitaMotors</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        {error ? <p>{error}</p> : null}
        {title !== "A carregar viatura..." ? (
          <Link className="vehicle-detail__cta" to="/catalogo">
            Voltar ao Catalogo
          </Link>
        ) : null}
      </section>
    </SitePage>
  );
}

export default VehicleDetailState;
