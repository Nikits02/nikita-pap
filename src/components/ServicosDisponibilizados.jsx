const services = [
  {
    title: "Consultoria Automovel",
    icon: "consultoria",
  },
  {
    title: "Compramos o seu Carro",
    icon: "compra",
  },
  {
    title: "Intermediacao de Credito",
    icon: "credito",
  },
  {
    title: "Entrega em Casa",
    icon: "entrega",
  },
  {
    title: "Garantia em todas as viaturas",
    icon: "garantia",
  },
  {
    title: "Test Drive",
    icon: "testdrive",
  },
  {
    title: "Pos Venda",
    icon: "posvenda",
  },
];

function IconBase({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function ServiceIcon({ type }) {
  if (type === "consultoria") {
    return (
      <IconBase>
        <path d="M7 6.5h10a2.5 2.5 0 0 1 2.5 2.5v5.2a2.5 2.5 0 0 1-2.5 2.5h-4.6L8 20v-3.3H7a2.5 2.5 0 0 1-2.5-2.5V9A2.5 2.5 0 0 1 7 6.5Z" />
        <path d="M8.5 10.2h7" />
        <path d="M8.5 13.4h5.2" />
      </IconBase>
    );
  }

  if (type === "compra") {
    return (
      <IconBase>
        <circle cx="17.6" cy="7.2" r="3.4" />
        <path d="M17.6 5.2v4" />
        <path d="M16.2 6.5h2.8" />
        <path d="M4.5 14.7h4.6l1.9 1.8h4.1l2.5-1a1.8 1.8 0 0 1 2.4 1 1.8 1.8 0 0 1-1 2.4l-3.8 1.5a4.7 4.7 0 0 1-3 .1L9.8 19H4.5" />
      </IconBase>
    );
  }

  if (type === "credito") {
    return (
      <IconBase>
        <rect x="4.5" y="7" width="15" height="10" rx="2.4" />
        <path d="M4.5 10.5h15" />
        <path d="M8 14h3.2" />
        <circle cx="18.1" cy="17.5" r="3.4" />
        <path d="M19.2 15.8c-.4-.2-.8-.4-1.2-.4-.9 0-1.6.5-1.6 1.2 0 1.6 3 1 3 2.5 0 .7-.7 1.3-1.7 1.3-.5 0-1-.2-1.4-.4" />
        <path d="M18 15v5" />
      </IconBase>
    );
  }

  if (type === "entrega") {
    return (
      <IconBase>
        <path d="M4.5 10 12 4.8 19.5 10" />
        <path d="M6.7 9.5V19h10.6V9.5" />
        <path d="M10 19v-4.2h4V19" />
        <path d="M13.6 13.4h4.2l1.7 2.5h-5.9" />
        <circle cx="15.1" cy="18.5" r="1.1" />
        <circle cx="18.7" cy="18.5" r="1.1" />
      </IconBase>
    );
  }

  if (type === "garantia") {
    return (
      <IconBase>
        <path d="M12 3.8 18.5 6v5c0 4.6-2.6 7.8-6.5 9.2C8.1 18.8 5.5 15.6 5.5 11V6L12 3.8Z" />
        <path d="m9.2 12.2 1.9 1.9 3.8-4.2" />
      </IconBase>
    );
  }

  if (type === "testdrive") {
    return (
      <IconBase>
        <circle cx="12" cy="12" r="7.3" />
        <circle cx="12" cy="12" r="2.3" />
        <path d="M6 10.6h12" />
        <path d="M12 9.7V4.7" />
        <path d="m9.5 19 1.2-4.7" />
        <path d="m14.5 19-1.2-4.7" />
      </IconBase>
    );
  }

  return (
    <IconBase>
      <path d="M14.7 5.3a3.2 3.2 0 0 0 4 4l-6.4 6.4a2 2 0 0 1-2.8-2.8l6.4-6.4a3.2 3.2 0 0 0-4-4" />
      <path d="m8.1 17.9-2.3 2.3" />
    </IconBase>
  );
}

function ServicosDisponibilizados() {
  return (
    <section className="services-section" aria-labelledby="servicos-disponibilizados">
      <div className="services-section__shell">
        <div className="services-section__heading">
          <h2 id="servicos-disponibilizados">Servicos Que Disponibilizamos</h2>
          <p>Saiba tudo o que podemos fazer por si!</p>
        </div>

        <div className="services-section__grid">
          {services.map((service, index) => (
            <article
              className={`service-card${index === services.length - 1 ? " service-card--last" : ""}`}
              key={service.title}
            >
              <div className="service-card__icon">
                <ServiceIcon type={service.icon} />
              </div>
              <h3>{service.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicosDisponibilizados;
