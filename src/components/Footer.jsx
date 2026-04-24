import { Fragment } from "react";
import { Link } from "react-router-dom";
import BrandWordmark from "./BrandWordmark";
import {
  footerContactItems,
  footerSocialLinks,
  legalLinks,
} from "../data/footer";
import useVehicles from "../hooks/useVehicles";
import { getFooterQuickLinks } from "../data/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LocationPinIcon,
  MailIcon,
  PhoneIcon,
  YouTubeIcon,
} from "./icons/CommonIcons";
import TypedIcon from "./icons/TypedIcon";
import { useAuth } from "../hooks/useAuth";
import { getVehicleLabel } from "../utils/vehicle";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
};

const contactIcons = {
  location: LocationPinIcon,
  mail: MailIcon,
  phone: PhoneIcon,
};

function Footer() {
  const { currentUser } = useAuth();
  const isAuthenticated = Boolean(currentUser);
  const footerQuickLinks = getFooterQuickLinks(isAuthenticated);
  const { vehicles, isLoading, error } = useVehicles();
  const footerVehicles = vehicles.slice(0, 6);

  return (
    <footer className="site-footer" id="empresa">
      <div className="site-footer__shell">
        <div className="site-footer__grid">
          <section className="site-footer__brand-column">
            <Link
              className="site-footer__brand-link"
              to="/"
              aria-label="Nikita Motos"
            >
              <BrandWordmark
                className="site-footer__brand-title"
                firstClassName="site-footer__brand-title-primary"
                secondClassName="site-footer__brand-title-accent"
              />
            </Link>

            <p className="site-footer__brand-text">
              Excelencia em cada quilometro.
            </p>

            <div className="site-footer__socials" aria-label="Redes sociais">
              {footerSocialLinks.map((item) => (
                <a
                  className="site-footer__social-link"
                  href={item.href}
                  aria-label={item.label}
                  key={item.label}
                >
                  <TypedIcon
                    type={item.icon}
                    icons={socialIcons}
                    fallback={InstagramIcon}
                  />
                </a>
              ))}
            </div>
          </section>

          <nav className="site-footer__column" aria-label="Links rapidos">
            <h3 className="site-footer__column-title">Links Rapidos</h3>
            <div className="site-footer__list">
              {footerQuickLinks.map((item) => (
                <Link
                  className="site-footer__list-link"
                  key={item.label}
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <section className="site-footer__column">
            <h3 className="site-footer__column-title">Viaturas em Catálogo</h3>
            <div className="site-footer__list">
              {isLoading ? (
                <span className="site-footer__list-text">A carregar...</span>
              ) : error || footerVehicles.length === 0 ? (
                <Link className="site-footer__list-link" to="/catalogo">
                  Ver catálogo
                </Link>
              ) : (
                footerVehicles.map((vehicle) => (
                  <Link
                    className="site-footer__list-link"
                    key={vehicle.id ?? vehicle.slug ?? getVehicleLabel(vehicle)}
                    to={vehicle.detailPath}
                  >
                    {getVehicleLabel(vehicle)}
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="site-footer__column" id="contactos">
            <h3 className="site-footer__column-title">Contacto</h3>
            <div className="site-footer__contact-list">
              {footerContactItems.map((item) => {
                const content = (
                  <>
                    <TypedIcon
                      type={item.icon}
                      icons={contactIcons}
                      fallback={LocationPinIcon}
                    />
                    <span>
                      {item.lines.map((line, index) => (
                        <Fragment key={line}>
                          {index > 0 ? <br /> : null}
                          {line}
                        </Fragment>
                      ))}
                    </span>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      className="site-footer__contact-item site-footer__contact-link"
                      href={item.href}
                      key={item.href}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div className="site-footer__contact-item" key={item.icon}>
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="site-footer__bottom-bar">
          <p>
            (c) 2026{" "}
            <BrandWordmark
              className="site-footer__bottom-brand"
              firstClassName="site-footer__bottom-brand-primary"
              secondClassName="site-footer__bottom-brand-accent"
            />
            . Todos os direitos reservados.
          </p>

          <nav className="site-footer__legal-links" aria-label="Links legais">
            {legalLinks.map((item) => (
              <a key={item} href="#">
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
