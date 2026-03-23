import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const termOptions = [24, 36, 48, 60, 72, 84];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

function CalculatorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5h10A2.5 2.5 0 0 1 19.5 6v12A2.5 2.5 0 0 1 17 20.5H7A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5Z" />
      <path d="M8.5 7.5h7" />
      <path d="M8.5 11.5h2M13.5 11.5h2M8.5 15.5h2M13.5 15.5h2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" />
      <path d="M12 8.5v4l2.5 1.5" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7.5 9.5 12l3-3 3.5 4 3-5" />
      <path d="M5 17.5h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z" />
      <path d="m9.5 12 1.8 1.8 3.4-3.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.2 17 6v4.7c0 3.5-1.9 6-5 7.6-3.1-1.6-5-4.1-5-7.6V6l5-1.8Z" />
    </svg>
  );
}

const benefits = [
  {
    icon: ClockIcon,
    text: "Aprovacao rapida em 24h",
  },
  {
    icon: GraphIcon,
    text: "Taxas competitivas",
  },
  {
    icon: CheckIcon,
    text: "Sem comissoes ocultas",
  },
  {
    icon: ShieldIcon,
    text: "Seguros integrados",
  },
];

function Financiamento() {
  const [simulation, setSimulation] = useState({
    preco: 120000,
    entrada: 24000,
    meses: 60,
    taxa: 6.9,
  });
  const [requestData, setRequestData] = useState({
    nome: "",
    email: "",
    telefone: "",
    viatura: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const entryPercent = Math.round((simulation.entrada / simulation.preco) * 100);
  const entryMax = Math.round(simulation.preco * 0.5);

  function updateSimulation(field, value) {
    setSimulation((current) => {
      const nextValue = Number(value);
      const nextSimulation = {
        ...current,
        [field]: nextValue,
      };

      if (field === "preco") {
        nextSimulation.entrada = Math.min(current.entrada, Math.round(nextValue * 0.5));
      }

      return nextSimulation;
    });
  }

  function updateRequest(field, value) {
    setRequestData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const result = useMemo(() => {
    const montanteFinanciado = Math.max(0, simulation.preco - simulation.entrada);
    const taxaMensal = simulation.taxa / 100 / 12;

    const prestacaoMensal =
      taxaMensal === 0
        ? montanteFinanciado / simulation.meses
        : montanteFinanciado *
          (taxaMensal / (1 - Math.pow(1 + taxaMensal, -simulation.meses)));

    const montanteTotal = prestacaoMensal * simulation.meses;
    const taeg = simulation.taxa + 1;

    return {
      montanteFinanciado,
      prestacaoMensal,
      montanteTotal,
      taeg,
    };
  }, [simulation]);

  return (
    <>
      <Navbar />

      <main className="page-shell finance-page">
        <section className="finance-grid">
          <section className="finance-card finance-card--simulator">
            <div className="finance-heading">
              <div className="finance-heading__icon">
                <CalculatorIcon />
              </div>
              <div>
                <h1>Simulador de Credito</h1>
              </div>
            </div>

            <div className="finance-control">
              <div className="finance-control__top">
                <span>Preco do veiculo</span>
                <strong>{formatCurrency(simulation.preco)} EUR</strong>
              </div>

              <input
                className="finance-range"
                type="range"
                min="30000"
                max="300000"
                step="1000"
                value={simulation.preco}
                onChange={(event) => updateSimulation("preco", event.target.value)}
              />

              <div className="finance-control__limits">
                <span>EUR30k</span>
                <span>EUR300k</span>
              </div>
            </div>

            <div className="finance-control">
              <div className="finance-control__top">
                <span>Entrada ({entryPercent}%)</span>
                <strong>{formatCurrency(simulation.entrada)} EUR</strong>
              </div>

              <input
                className="finance-range"
                type="range"
                min="0"
                max={entryMax}
                step="500"
                value={simulation.entrada}
                onChange={(event) => updateSimulation("entrada", event.target.value)}
              />

              <div className="finance-control__limits">
                <span>EUR0</span>
                <span>{formatCurrency(entryMax)} EUR</span>
              </div>
            </div>

            <div className="finance-control">
              <div className="finance-control__top">
                <span>Prazo (meses)</span>
                <strong>{simulation.meses} meses</strong>
              </div>

              <div className="finance-term-grid">
                {termOptions.map((months) => (
                  <button
                    key={months}
                    className={`finance-term-button${simulation.meses === months ? " is-active" : ""}`}
                    type="button"
                    onClick={() => updateSimulation("meses", months)}
                  >
                    {months}
                  </button>
                ))}
              </div>
            </div>

            <div className="finance-control finance-control--last">
              <div className="finance-control__top">
                <span>Taxa de juro (TAN)</span>
                <strong>{simulation.taxa.toFixed(1)}%</strong>
              </div>

              <input
                className="finance-range"
                type="range"
                min="2"
                max="15"
                step="0.1"
                value={simulation.taxa}
                onChange={(event) => updateSimulation("taxa", event.target.value)}
              />

              <div className="finance-control__limits">
                <span>2%</span>
                <span>15%</span>
              </div>
            </div>

            <div className="finance-results">
              <div className="finance-result">
                <span>Prestacao mensal</span>
                <strong>{formatCurrency(result.prestacaoMensal)} EUR</strong>
              </div>

              <div className="finance-result">
                <span>Montante total</span>
                <strong>{formatCurrency(result.montanteTotal)} EUR</strong>
              </div>

              <div className="finance-result">
                <span>TAEG</span>
                <strong>{result.taeg.toFixed(1)}%</strong>
              </div>
            </div>

            <p className="finance-disclaimer">
              Valores indicativos. Sujeito a aprovacao de credito. Consulte as
              condicoes completas.
            </p>
          </section>

          <aside className="finance-column">
            <section className="finance-benefits">
              <h2>Vantagens do Nosso Financiamento</h2>

              <div className="finance-benefits__list">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <article className="finance-benefit" key={benefit.text}>
                      <div className="finance-benefit__icon">
                        <Icon />
                      </div>
                      <span>{benefit.text}</span>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="finance-card finance-card--request">
              <h2>Pedir Financiamento</h2>

              <form className="finance-request-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={requestData.nome}
                  onChange={(event) => updateRequest("nome", event.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={requestData.email}
                  onChange={(event) => updateRequest("email", event.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={requestData.telefone}
                  onChange={(event) => updateRequest("telefone", event.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Veiculo de interesse"
                  value={requestData.viatura}
                  onChange={(event) => updateRequest("viatura", event.target.value)}
                />

                <button className="finance-submit" type="submit">
                  Pedir Financiamento
                </button>
              </form>

              {submitted && (
                <div className="finance-success">
                  <strong>Pedido enviado com sucesso.</strong>
                  <span>Entraremos em contacto consigo com a maior brevidade.</span>
                </div>
              )}
            </section>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Financiamento;
