import { useEffect, useMemo, useState } from "react";
import {
  CalculatorIcon,
  CheckCircleIcon,
  ClockCircleIcon,
  GraphTrendIcon,
  ShieldIcon,
} from "../components/icons/CommonIcons";
import CustomSelect from "../components/form/CustomSelect";
import TypedIcon from "../components/icons/TypedIcon";
import SitePage from "../components/SitePage";
import {
  financeBenefits,
  financeRequestFields,
  termOptions,
} from "../data/finance";
import useFormState from "../hooks/useFormState";
import useVehicles from "../hooks/useVehicles";
import { createFinanceRequest } from "../services/api";
import { formatRoundedNumber } from "../utils/format";
import { getVehicleLabel } from "../utils/vehicle";

const benefitIcons = {
  check: CheckCircleIcon,
  clock: ClockCircleIcon,
  graph: GraphTrendIcon,
  shield: ShieldIcon,
};

const FIXED_INTEREST_RATE = 6.9;

function Financiamento() {
  const {
    vehicles,
    isLoading: isLoadingVehicles,
    error: vehicleError,
  } = useVehicles();
  const [simulation, setSimulation] = useState({
    preco: 120000,
    entrada: 24000,
    meses: 60,
    taxa: FIXED_INTEREST_RATE,
  });
  const { formData: requestData, updateField: updateRequest } = useFormState({
    nome: "",
    email: "",
    telefone: "",
    viatura: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceRange = useMemo(() => {
    const vehiclePrices = vehicles
      .map((vehicle) => Number(vehicle.preco))
      .filter((price) => Number.isFinite(price) && price > 0);

    if (vehiclePrices.length === 0) {
      return {
        min: 30000,
        max: 300000,
      };
    }

    return {
      min: Math.min(...vehiclePrices),
      max: Math.max(...vehiclePrices),
    };
  }, [vehicles]);

  const availableVehicles = useMemo(
    () =>
      [...vehicles]
        .sort((firstVehicle, secondVehicle) =>
          getVehicleLabel(firstVehicle).localeCompare(
            getVehicleLabel(secondVehicle),
            "pt",
            { sensitivity: "base" },
          ),
        )
        .map((vehicle) => {
          const vehicleLabel = getVehicleLabel(vehicle);
          const optionLabel = vehicle.ano
            ? `${vehicleLabel} (${vehicle.ano})`
            : vehicleLabel;

          return {
            value: optionLabel,
            label: optionLabel,
          };
        }),
    [vehicles],
  );

  const isVehicleSelectDisabled =
    isLoadingVehicles || availableVehicles.length === 0;
  const vehicleSelectPlaceholder = isLoadingVehicles
    ? "A carregar viaturas..."
    : availableVehicles.length > 0
      ? "Veiculo de interesse"
      : "Sem viaturas disponiveis";

  useEffect(() => {
    setSimulation((current) => {
      const nextPrice = Math.min(
        Math.max(current.preco, priceRange.min),
        priceRange.max,
      );
      const nextEntryMax = Math.round(nextPrice * 0.5);

      return {
        ...current,
        preco: nextPrice,
        entrada: Math.min(current.entrada, nextEntryMax),
      };
    });
  }, [priceRange.max, priceRange.min]);

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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createFinanceRequest({
        nome: requestData.nome,
        email: requestData.email,
        telefone: requestData.telefone,
        viatura: requestData.viatura,
        preco: simulation.preco,
        entrada: simulation.entrada,
        meses: simulation.meses,
        taxa: simulation.taxa,
        prestacaoMensal: result.prestacaoMensal,
        montanteTotal: result.montanteTotal,
        taeg: result.taeg,
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message ?? "Nao foi possivel guardar o pedido de financiamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

  const requestSummaryItems = [
    {
      label: "Preco",
      value: `${formatRoundedNumber(simulation.preco)} EUR`,
    },
    {
      label: "Entrada",
      value: `${formatRoundedNumber(simulation.entrada)} EUR`,
    },
    {
      label: "Prazo",
      value: `${simulation.meses} meses`,
    },
    {
      label: "Prestacao",
      value: `${formatRoundedNumber(result.prestacaoMensal)} EUR`,
    },
  ];

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
              min={priceRange.min}
              max={priceRange.max}
              step="1000"
              value={simulation.preco}
              onChange={(event) =>
                updateSimulation("preco", event.target.value)
              }
            />

            <div className="finance-control__limits">
              <span>{formatRoundedNumber(priceRange.min)} EUR</span>
              <span>{formatRoundedNumber(priceRange.max)} EUR</span>
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
              <span>Taxa de juro fixa (TAN)</span>
              <strong>{simulation.taxa.toFixed(1)}%</strong>
            </div>

            <p className="finance-fixed-rate-note">
              Esta simulacao utiliza uma TAN fixa de{" "}
              <strong>{FIXED_INTEREST_RATE.toFixed(1)}%</strong>.
            </p>
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
            <p className="finance-request-copy">
              Envie o pedido com a simulacao atual e a nossa equipa entra em
              contacto consigo para apresentar as condicoes finais.
            </p>

            <div className="finance-request-summary" aria-label="Resumo da simulacao">
              {requestSummaryItems.map((item) => (
                <article className="finance-request-summary__item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            <form className="finance-request-form" onSubmit={handleSubmit}>
              {financeRequestFields.map((field) =>
                field.name === "viatura" ? (
                  <CustomSelect
                    key={field.name}
                    value={requestData[field.name]}
                    options={availableVehicles}
                    placeholder={vehicleSelectPlaceholder}
                    onChange={(value) => updateRequest(field.name, value)}
                    disabled={isVehicleSelectDisabled}
                    rootClassName={`vehicle-search__select${isVehicleSelectDisabled ? " is-disabled" : ""}`}
                    triggerClassName="vehicle-search__select-trigger"
                    menuClassName="vehicle-search__select-menu"
                    optionClassName="vehicle-search__select-option"
                  />
                ) : (
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
                ),
              )}

              {vehicleError ? (
                <p className="finance-request-form__hint">{vehicleError}</p>
              ) : null}

              {submitError ? (
                <p className="finance-request-form__error">{submitError}</p>
              ) : null}

              <button className="finance-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "A enviar..." : "Pedir Financiamento"}
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
