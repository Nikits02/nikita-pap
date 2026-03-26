import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m20 5-9.2 8.2" />
      <path d="m20 5-6 14-3.2-5-5-3.2L20 5Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

const testDriveHours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const contactSubjectOptions = [
  { value: "Pedido de Informacao", label: "Pedido de Informacao" },
  { value: "Pedido de Test Drive", label: "Pedido de Test Drive" },
  { value: "Financiamento", label: "Financiamento" },
  { value: "Retoma", label: "Retoma" },
];

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
  dataPreferida: "",
  horaPreferida: "",
};

function buildInitialForm(assuntoParam, veiculoParam) {
  return {
    ...initialForm,
    assunto: assuntoParam,
    mensagem: veiculoParam
      ? `Gostaria de agendar um teste drive para a viatura ${veiculoParam}.`
      : "",
  };
}

function getTodayDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset).toISOString().split("T")[0];
}

function ContactSelect({ value, options, placeholder, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="contact-select" ref={rootRef}>
      <button
        className={`contact-select__trigger${isOpen ? " is-open" : ""}${!value ? " is-placeholder" : ""}`}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <ChevronIcon />
      </button>

      {isOpen ? (
        <div className="contact-select__menu" role="listbox">
          {options.map((option) => (
            <button
              className={`contact-select__option${value === option.value ? " is-active" : ""}`}
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Contacto() {
  const [searchParams] = useSearchParams();
  const assuntoParam = searchParams.get("assunto") ?? "";
  const veiculoParam = searchParams.get("veiculo") ?? "";
  const isTestDriveFlow = assuntoParam === "Pedido de Test Drive" || Boolean(veiculoParam);
  const [formData, setFormData] = useState(() =>
    buildInitialForm(assuntoParam, veiculoParam),
  );
  const [submitted, setSubmitted] = useState(false);
  const [testDriveError, setTestDriveError] = useState("");
  const [contactError, setContactError] = useState("");
  const [todayDate] = useState(() => getTodayDateString());

  function updateField(field, value) {
    if (field === "horaPreferida") {
      setTestDriveError("");
    }

    if (field === "assunto") {
      setContactError("");
    }

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isTestDriveFlow && !formData.horaPreferida) {
      setTestDriveError("Selecione uma hora preferida para o teste drive.");
      return;
    }

    if (!isTestDriveFlow && !formData.assunto) {
      setContactError("Selecione um assunto antes de enviar a mensagem.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <>
      <Navbar />

      <main className="page-shell contact-page">
        <section className="contact-hero">
          <h1>Contacto</h1>
          <p>Estamos aqui para si</p>
        </section>

        <section className="contact-page__layout">
          <aside className="contact-info-panel">
            <div className="contact-info-list">
              <article className="contact-info-item">
                <div className="contact-info-item__icon">
                  <LocationIcon />
                </div>
                <div>
                  <span>Morada</span>
                  <p>Escola da APEL</p>
                  <p>Funchal, Madeira</p>
                </div>
              </article>

              <article className="contact-info-item">
                <div className="contact-info-item__icon">
                  <PhoneIcon />
                </div>
                <div>
                  <span>Telefone</span>
                  <p>+351 912 345 678</p>
                  <p>+351 291 123 456</p>
                </div>
              </article>

              <article className="contact-info-item">
                <div className="contact-info-item__icon">
                  <MailIcon />
                </div>
                <div>
                  <span>Email</span>
                  <p>geral@nikitamotors.pt</p>
                  <p>vendas@nikitamotors.pt</p>
                </div>
              </article>

              <article className="contact-info-item">
                <div className="contact-info-item__icon">
                  <ClockIcon />
                </div>
                <div>
                  <span>Horario</span>
                  <p>Segunda a Sexta: 9h00 - 19h00</p>
                  <p>Sabado: 9h00 - 13h00</p>
                  <p>Domingo: Fechado</p>
                </div>
              </article>
            </div>

            <div className="contact-map-card">
              <div className="contact-map-card__embed">
                <iframe
                  title="Mapa da Escola da APEL"
                  src="https://www.google.com/maps?q=Escola+da+APEL+Funchal&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="contact-map-card__pin">
                <LocationIcon />
              </div>
              <p>Escola da APEL, Funchal</p>
              <a
                href="https://www.google.com/maps?q=Escola+da+APEL+Funchal"
                target="_blank"
                rel="noreferrer"
              >
                Ver no Google Maps
              </a>
            </div>
          </aside>

          <section className="contact-form-panel">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <PlaneIcon />
                </div>
                <h2>{isTestDriveFlow ? "Agendamento enviado!" : "Mensagem enviada!"}</h2>
                <p>
                  {isTestDriveFlow
                    ? "Recebemos o seu pedido de teste drive e vamos entrar em contacto para confirmar a data e a hora escolhidas."
                    : "Recebemos o seu pedido e vamos responder com a maior brevidade."}
                </p>
              </div>
            ) : isTestDriveFlow ? (
              <form className="contact-form contact-form--test-drive" onSubmit={handleSubmit}>
                <div className="test-drive-intro">
                  <p className="test-drive-intro__kicker">Pedido de Test Drive</p>
                  <h2>{veiculoParam || "Agende o seu Teste Drive"}</h2>
                  <p>
                    Escolha a data, a hora e deixe os seus dados para confirmarmos o
                    agendamento consigo.
                  </p>
                </div>

                {veiculoParam ? (
                  <div className="test-drive-vehicle-card">
                    <span>Viatura selecionada</span>
                    <strong>{veiculoParam}</strong>
                  </div>
                ) : null}

                <section className="test-drive-section">
                  <div className="test-drive-section__header">
                    <span className="test-drive-section__step">1</span>
                    <h3>Data e Hora</h3>
                  </div>

                  <div className="test-drive-section__grid">
                    <label className="contact-field">
                      <span>Data Preferida *</span>
                      <input
                        type="date"
                        min={todayDate}
                        value={formData.dataPreferida}
                        onChange={(event) => updateField("dataPreferida", event.target.value)}
                        required
                      />
                    </label>

                    <div className="contact-field">
                      <span>Hora Preferida *</span>
                      <div className="test-drive-hours">
                        {testDriveHours.map((hour) => (
                          <button
                            key={hour}
                            className={`test-drive-hours__option${
                              formData.horaPreferida === hour ? " is-active" : ""
                            }`}
                            type="button"
                            onClick={() => updateField("horaPreferida", hour)}
                          >
                            {hour}
                          </button>
                        ))}
                      </div>
                      {testDriveError ? (
                        <p className="test-drive-hours__error">{testDriveError}</p>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="test-drive-section">
                  <div className="test-drive-section__header">
                    <span className="test-drive-section__step">2</span>
                    <h3>Dados Pessoais</h3>
                  </div>

                  <div className="contact-form__grid contact-form__grid--test-drive">
                    <label className="contact-field">
                      <span>Nome Completo *</span>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(event) => updateField("nome", event.target.value)}
                        required
                      />
                    </label>

                    <label className="contact-field">
                      <span>Telefone *</span>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(event) => updateField("telefone", event.target.value)}
                        required
                      />
                    </label>

                    <label className="contact-field">
                      <span>Email *</span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                </section>

                <input type="hidden" value={formData.assunto} readOnly />
                <input type="hidden" value={formData.mensagem} readOnly />

                <button className="contact-submit test-drive-submit" type="submit">
                  <PlaneIcon />
                  <span>Confirmar Agendamento</span>
                </button>
              </form>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__grid">
                  <label className="contact-field">
                    <span>Nome *</span>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(event) => updateField("nome", event.target.value)}
                      required
                    />
                  </label>

                  <label className="contact-field">
                    <span>Email *</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      required
                    />
                  </label>

                  <label className="contact-field">
                    <span>Telefone</span>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(event) => updateField("telefone", event.target.value)}
                    />
                  </label>

                  <label className="contact-field">
                    <span>Assunto *</span>
                    <ContactSelect
                      value={formData.assunto}
                      options={contactSubjectOptions}
                      placeholder="-"
                      onChange={(value) => updateField("assunto", value)}
                    />
                    {contactError ? (
                      <p className="contact-field__error">{contactError}</p>
                    ) : null}
                  </label>
                </div>

                <label className="contact-field contact-field--full">
                  <span>Mensagem *</span>
                  <textarea
                    rows="7"
                    value={formData.mensagem}
                    onChange={(event) => updateField("mensagem", event.target.value)}
                    required
                  />
                </label>

                <button className="contact-submit" type="submit">
                  <PlaneIcon />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contacto;
