import { Link } from "react-router-dom";
import PageHero from "../../components/PageHero";
import SitePage from "../../components/SitePage";

function NotFound() {
  return (
    <SitePage mainClassName="page-shell not-found-page">
      <PageHero
        className="contact-hero catalog-page__hero"
        title="Pagina nao encontrada"
        description="A pagina que procuras pode ter sido movida ou ja nao estar disponivel."
      />

      <div className="not-found-page__actions">
        <Link className="primary-button" to="/">
          Voltar ao inicio
        </Link>
        <Link className="secondary-button" to="/catalogo">
          Ver catalogo
        </Link>
      </div>
    </SitePage>
  );
}

export default NotFound;
