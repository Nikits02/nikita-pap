import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Sobre Nos", to: "/sobre" },
  { label: "Catalogo", to: "/catalogo" },
  { label: "Financiamento", to: "/financiamento" },
  { label: "Retoma", to: "/retoma" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

const featuredBrands = [
  "Peugeot",
  "Citroen",
  "MINI",
  "Opel",
  "Renault",
  "Fiat",
];

const legalLinks = [
  "Politica de Privacidade",
  "Termos e Condicoes",
  "Politica de Cookies",
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 19v-6h2.2l.3-2.5h-2.5V8.9c0-.8.2-1.4 1.4-1.4H16V5.3c-.4-.1-1-.2-1.8-.2-1.8 0-3.1 1.1-3.1 3.2v2.2H9V13h2.3v6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 9.4V19" />
      <path d="M7.2 5.8h0" />
      <path d="M11.4 19v-5.4c0-1.7 1-2.8 2.5-2.8s2.3 1 2.3 2.8V19" />
      <path d="M11.4 11V9.4" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 8.3c-.2-.9-.9-1.6-1.8-1.8C15.8 6.2 12 6.2 12 6.2s-3.8 0-5.2.3c-.9.2-1.6.9-1.8 1.8-.3 1.4-.3 3.7-.3 3.7s0 2.3.3 3.7c.2.9.9 1.6 1.8 1.8 1.4.3 5.2.3 5.2.3s3.8 0 5.2-.3c.9-.2 1.6-.9 1.8-1.8.3-1.4.3-3.7.3-3.7s0-2.3-.3-3.7Z" />
      <path d="m10.3 14.7 4.3-2.7-4.3-2.7v5.4Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20s5.5-5 5.5-10.2a5.5 5.5 0 1 0-11 0C6.5 15 12 20 12 20Z" />
      <circle cx="12" cy="9.8" r="1.7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.3 5.8c.4-.4 1-.4 1.4 0l1.6 1.6c.4.4.4 1 0 1.4l-1.1 1.1c.8 1.5 2 2.7 3.5 3.5l1.1-1.1c.4-.4 1-.4 1.4 0l1.6 1.6c.4.4.4 1 0 1.4l-.9.9c-.7.7-1.7 1-2.7.8-4.5-1-8.1-4.6-9.1-9.1-.2-1 .1-2 .8-2.7l.9-.9Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7.5h14v9H5z" />
      <path d="m5.5 8 6.5 5 6.5-5" />
    </svg>
  );
}

function Footer() {
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
              <span className="site-footer__brand-title">
                <span className="site-footer__brand-title-primary">Nikita</span>
                <span className="site-footer__brand-title-accent">Motors</span>
              </span>
            </Link>

            <p className="site-footer__brand-text">
              Excelencia em cada quilometro.
            </p>

            <div className="site-footer__socials" aria-label="Redes sociais">
              <a
                className="site-footer__social-link"
                href="#"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                className="site-footer__social-link"
                href="#"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                className="site-footer__social-link"
                href="#"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                className="site-footer__social-link"
                href="#"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </section>

          <nav className="site-footer__column" aria-label="Links rapidos">
            <h3 className="site-footer__column-title">Links Rapidos</h3>
            <div className="site-footer__list">
              {quickLinks.map((item) => (
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
            <h3 className="site-footer__column-title">As Nossas Marcas</h3>
            <div className="site-footer__list">
              {featuredBrands.map((item) => (
                <span className="site-footer__list-text" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="site-footer__column" id="contactos">
            <h3 className="site-footer__column-title">Contacto</h3>
            <div className="site-footer__contact-list">
              <div className="site-footer__contact-item">
                <LocationIcon />
                <span>
                  Escola da APEL
                  <br />
                  Funchal, Madeira
                </span>
              </div>

              <a
                className="site-footer__contact-item site-footer__contact-link"
                href="tel:+351912345678"
              >
                <PhoneIcon />
                <span>+351 912 345 678</span>
              </a>

              <a
                className="site-footer__contact-item site-footer__contact-link"
                href="mailto:geral@nikitamotors.pt"
              >
                <MailIcon />
                <span>geral@nikitamotors.pt</span>
              </a>
            </div>
          </section>
        </div>

        <div className="site-footer__bottom-bar">
          <p>
            (c) 2026{" "}
            <span className="site-footer__bottom-brand">
              <span className="site-footer__bottom-brand-primary">Nikita</span>
              <span className="site-footer__bottom-brand-accent">Motors</span>
            </span>
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
