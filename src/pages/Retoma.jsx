import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const currentYear = new Date().getFullYear();

const tradeInSteps = [
  { number: "1", title: "Preencha o formulario", icon: "clipboard" },
  { number: "2", title: "Receba uma estimativa", icon: "search" },
  { number: "3", title: "Inspecao presencial", icon: "car" },
  { number: "4", title: "Proposta final", icon: "check" },
];

function StepIcon({ type }) {
  if (type === "clipboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
        <path d="M9.5 4.5h5V7h-5z" />
        <path d="M9.5 10h5M9.5 13h5M9.5 16h3" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 4 4" />
      </svg>
    );
  }

  if (type === "car") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 15.5h10l1.2-3.2a1.4 1.4 0 0 0-1.3-1.9H7.1a1.4 1.4 0 0 0-1.3.9L4.6 15.5H7Z" />
        <path d="M5.5 15.5h13a1 1 0 0 1 1 1v1h-2v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2H9v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2h-2v-1a1 1 0 0 1 1-1Z" />
        <circle cx="8" cy="16.5" r=".8" fill="currentColor" stroke="none" />
        <circle cx="16" cy="16.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
      <path d="m9.2 12.2 1.8 1.8 4-4.3" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.8 12.1 2.1 2.1 4.6-5" />
    </svg>
  );
}

function Retoma() {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: 2020,
    quilometragem: 50000,
    estado: "",
    nome: "",
    telefone: "",
    email: "",
    observacoes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: field === "ano" || field === "quilometragem" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />

      <main className="page-shell tradein-page">
        <section className="tradein-hero">
          <p className="section-kicker">NikitaMotors</p>
          <h1>Avaliacao de Retoma</h1>
          <p>Avalie o seu veiculo atual e receba uma proposta justa</p>
        </section>

        <section className="tradein-process">
          <h2>Como Funciona</h2>

          <div className="tradein-process__grid">
            {tradeInSteps.map((step) => (
              <article className="tradein-step" key={step.number}>
                <div className="tradein-step__visual">
                  <div className="tradein-step__icon">
                    <StepIcon type={step.icon} />
                  </div>
                  <span className="tradein-step__number">{step.number}</span>
                  <div className="tradein-step__line" />
                </div>
                <h3>{step.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="tradein-form-section">
          {submitted ? (
            <div className="tradein-success">
              <div className="tradein-success__icon">
                <SuccessIcon />
              </div>
              <h2>Pedido Recebido!</h2>
              <p>
                A nossa equipa ira analisar os dados do seu veiculo e entrar em
                contacto em breve com uma estimativa de avaliacao.
              </p>
            </div>
          ) : (
            <form className="tradein-form-card" onSubmit={handleSubmit}>
              <div className="tradein-section-heading">
                <h2>Dados do Veiculo</h2>
              </div>

              <div className="tradein-form-grid tradein-form-grid--vehicle">
                <label className="tradein-field">
                  <span>Marca *</span>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(event) => updateField("marca", event.target.value)}
                    placeholder="ex: Mercedes-Benz"
                    required
                  />
                </label>

                <label className="tradein-field">
                  <span>Modelo *</span>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(event) => updateField("modelo", event.target.value)}
                    placeholder="ex: C 300"
                    required
                  />
                </label>

                <label className="tradein-field">
                  <span>Ano *</span>
                  <input
                    type="number"
                    min="1990"
                    max={currentYear}
                    value={formData.ano}
                    onChange={(event) => updateField("ano", event.target.value)}
                    required
                  />
                </label>

                <label className="tradein-field">
                  <span>Quilometros *</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.quilometragem}
                    onChange={(event) =>
                      updateField("quilometragem", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="tradein-field">
                  <span>Estado Geral *</span>
                  <select
                    value={formData.estado}
                    onChange={(event) => updateField("estado", event.target.value)}
                    required
                  >
                    <option value="">-</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Muito Bom">Muito Bom</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                  </select>
                </label>
              </div>

              <div className="tradein-section-heading tradein-section-heading--contact">
                <h2>Dados de Contacto</h2>
              </div>

              <div className="tradein-form-grid tradein-form-grid--contact">
                <label className="tradein-field">
                  <span>Nome Completo *</span>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(event) => updateField("nome", event.target.value)}
                    required
                  />
                </label>

                <label className="tradein-field">
                  <span>Telefone *</span>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(event) => updateField("telefone", event.target.value)}
                    required
                  />
                </label>

                <label className="tradein-field tradein-field--full">
                  <span>Email *</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                  />
                </label>

                <label className="tradein-field tradein-field--full">
                  <span>Observacoes</span>
                  <textarea
                    rows="5"
                    value={formData.observacoes}
                    onChange={(event) =>
                      updateField("observacoes", event.target.value)
                    }
                    placeholder="Informacoes adicionais sobre o veiculo..."
                  />
                </label>
              </div>

              <button className="tradein-submit" type="submit">
                Solicitar Avaliacao
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Retoma;
