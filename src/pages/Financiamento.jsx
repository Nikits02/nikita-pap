import { useMemo, useState } from "react";
import {
  CalculatorIcon,
  CheckCircleIcon,
  ClockCircleIcon,
  GraphTrendIcon,
  ShieldIcon,
} from "../components/icons/CommonIcons";
import TypedIcon from "../components/icons/TypedIcon";
import SitePage from "../components/SitePage";
import {
  financeBenefits,
  financeRequestFields,
  termOptions,
} from "../data/finance";
import useFormState from "../hooks/useFormState";
import { formatRoundedNumber } from "../utils/format";

const benefitIcons = {
  check: CheckCircleIcon,
  clock: ClockCircleIcon,
  graph: GraphTrendIcon,
  shield: ShieldIcon,
};

function Financiamento() {
  const [simulation, setSimulation] = useState({
    preco: 120000,
    entrada: 24000,
    meses: 60,
    taxa: 6.9,
  });
  const { formData: requestData, updateField: updateRequest } = useFormState({
    nome: "",
    email: "",
    telefone: "",
    viatura: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const entryPercent = Math.round(
    (simulation.entrada / simulation.preco) * 100,
  );
  const entryMax = Math.round(simulation.preco * 0.5);

  function updateSimulation(field, value) {
    setSimulation((current) => {
      const nextValue = Number(value);
      const nextSimulation = {
        ...current,
        [field]: nextValue,
      };

      if (field === "preco") {
        nextSimulation.entrada = Math.min(
          current.entrada,
          Math.round(nextValue * 0.5),
        );
      }

      return nextSimulation;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  const result = useMemo(() => {
    const montanteFinanciado = Math.max(
      0,
      simulation.preco - simulation.entrada,
    );
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
    <SitePage mainClassName="page-shell finance-page">
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
              <strong>{formatRoundedNumber(simulation.preco)} EUR</strong>
            </div>

            <input
              className="finance-range"
              type="range"
              min="30000"
              max="300000"
              step="1000"
              value={simulation.preco}
              onChange={(event) =>
                updateSimulation("preco", event.target.value)
              }
            />

            <div className="finance-control__limits">
              <span>EUR30k</span>
              <span>EUR300k</span>
            </div>
          </div>

          <div className="finance-control">
            <div className="finance-control__top">
              <span>Entrada ({entryPercent}%)</span>
              <strong>{formatRoundedNumber(simulation.entrada)} EUR</strong>
            </div>

            <input
              className="finance-range"
              type="range"
              min="0"
              max={entryMax}
              step="500"
              value={simulation.entrada}
              onChange={(event) =>
                updateSimulation("entrada", event.target.value)
              }
            />

            <div className="finance-control__limits">
              <span>EUR0</span>
              <span>{formatRoundedNumber(entryMax)} EUR</span>
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
              onChange={(event) =>
                updateSimulation("taxa", event.target.value)
              }
            />

            <div className="finance-control__limits">
              <span>2%</span>
              <span>15%</span>
            </div>
          </div>

          <div className="finance-results">
            <div className="finance-result">
              <span>Prestacao mensal</span>
              <strong>{formatRoundedNumber(result.prestacaoMensal)} EUR</strong>
            </div>

            <div className="finance-result">
              <span>Montante total</span>
              <strong>{formatRoundedNumber(result.montanteTotal)} EUR</strong>
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
              {financeBenefits.map((benefit) => {
                return (
                  <article className="finance-benefit" key={benefit.text}>
                    <div className="finance-benefit__icon">
                      <TypedIcon
                        type={benefit.icon}
                        icons={benefitIcons}
                        fallback={ShieldIcon}
                      />
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
              {financeRequestFields.map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={requestData[field.name]}
                  onChange={(event) =>
                    updateRequest(field.name, event.target.value)
                  }
                  required={field.required}
                />
              ))}

              <button className="finance-submit" type="submit">
                Pedir Financiamento
              </button>
            </form>

            {submitted ? (
              <div className="finance-success">
                <strong>Pedido enviado com sucesso.</strong>
                <span>
                  Entraremos em contacto consigo com a maior brevidade.
                </span>
              </div>
            ) : null}
          </section>
        </aside>
      </section>
    </SitePage>
  );
}

export default Financiamento;
