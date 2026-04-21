import { useEffect, useMemo, useState } from "react";
import {
  CalculatorIcon,
  CheckCircleIcon,
  ClockCircleIcon,
  GraphTrendIcon,
  ShieldIcon,
} from "../../components/icons/CommonIcons";
import CustomSelect from "../../components/form/CustomSelect";
import TypedIcon from "../../components/icons/TypedIcon";
import SitePage from "../../components/SitePage";
import {
  financeBenefits,
  financeRequestFields,
  termOptions,
} from "../../data/finance";
import useFormState from "../../hooks/useFormState";
import useVehicles from "../../hooks/useVehicles";
import { createFinanceRequest } from "../../services/api";
import { formatRoundedNumber } from "../../utils/format";
import { getVehicleLabel } from "../../utils/vehicle";

const benefitIcons = {
  check: CheckCircleIcon,
  clock: ClockCircleIcon,
  graph: GraphTrendIcon,
  shield: ShieldIcon,
};

const FIXED_INTEREST_RATE = 6.9;
const FALLBACK_PRICE_RANGE = {
  min: 30000,
  max: 300000,
};

function formatEuroAmount(value) {
  return `${formatRoundedNumber(value)} EUR`;
}

function getClosestPrice(price, priceOptions) {
  return priceOptions.reduce((closestPrice, optionPrice) =>
    Math.abs(optionPrice - price) < Math.abs(closestPrice - price)
      ? optionPrice
      : closestPrice,
  );
}

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

  const vehiclePriceOptions = useMemo(() => {
    const vehiclePrices = vehicles.map((vehicle) => Number(vehicle.preco));

    return [...new Set(vehiclePrices)]
      .filter((price) => Number.isFinite(price) && price > 0)
      .sort((firstPrice, secondPrice) => firstPrice - secondPrice);
  }, [vehicles]);

  const hasVehiclePriceOptions = vehiclePriceOptions.length > 0;

  const priceRange = hasVehiclePriceOptions
    ? {
        min: vehiclePriceOptions[0],
        max: vehiclePriceOptions.at(-1),
      }
    : FALLBACK_PRICE_RANGE;

  const selectedPriceIndex = hasVehiclePriceOptions
    ? vehiclePriceOptions.indexOf(simulation.preco)
    : 0;

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

          return { value: optionLabel, label: optionLabel, price: Number(vehicle.preco) };
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
      const nextPrice = hasVehiclePriceOptions
        ? getClosestPrice(current.preco, vehiclePriceOptions)
        : Math.min(Math.max(current.preco, priceRange.min), priceRange.max);
      const nextEntryMax = Math.round(nextPrice * 0.5);

      return {
        ...current,
        preco: nextPrice,
        entrada: Math.min(current.entrada, nextEntryMax),
      };
    });
  }, [hasVehiclePriceOptions, priceRange.max, priceRange.min, vehiclePriceOptions]);

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

  function handleVehicleSelect(value) {
    updateRequest("viatura", value);

    const selectedVehicle = availableVehicles.find((vehicle) => vehicle.value === value);

    if (Number.isFinite(selectedVehicle?.price)) {
      updateSimulation("preco", selectedVehicle.price);
    }
  }

  function handlePriceIndexChange(value) {
    const nextPrice = vehiclePriceOptions[Number(value)];

    if (nextPrice) {
      updateSimulation("preco", nextPrice);
    }
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
        taxa: FIXED_INTEREST_RATE,
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
    const taxaMensal = FIXED_INTEREST_RATE / 100 / 12;

    const prestacaoMensal =
      taxaMensal === 0
        ? montanteFinanciado / simulation.meses
        : montanteFinanciado *
          (taxaMensal / (1 - Math.pow(1 + taxaMensal, -simulation.meses)));

    return {
      prestacaoMensal,
      montanteTotal: prestacaoMensal * simulation.meses,
      taeg: FIXED_INTEREST_RATE + 1,
    };
  }, [simulation]);

  const requestSummaryItems = [
    ["Preco", formatEuroAmount(simulation.preco)],
    ["Entrada", formatEuroAmount(simulation.entrada)],
    ["Prazo", `${simulation.meses} meses`],
    ["Prestacao", formatEuroAmount(result.prestacaoMensal)],
  ];

  const resultItems = [
    ["Prestacao mensal", formatEuroAmount(result.prestacaoMensal)],
    ["Montante total", formatEuroAmount(result.montanteTotal)],
    ["TAEG", `${result.taeg.toFixed(1)}%`],
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
              <strong>{formatEuroAmount(simulation.preco)}</strong>
            </div>

            <input
              className="finance-range"
              type="range"
              min="0"
              max={Math.max(vehiclePriceOptions.length - 1, 0)}
              step="1"
              value={Math.max(selectedPriceIndex, 0)}
              onChange={(event) => handlePriceIndexChange(event.target.value)}
              disabled={!hasVehiclePriceOptions}
            />

            <div className="finance-control__limits">
              <span>{formatEuroAmount(priceRange.min)}</span>
              <span>{formatEuroAmount(priceRange.max)}</span>
            </div>
          </div>

          <div className="finance-control">
            <div className="finance-control__top">
              <span>Entrada ({entryPercent}%)</span>
              <strong>{formatEuroAmount(simulation.entrada)}</strong>
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
              <span>{formatEuroAmount(entryMax)}</span>
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
              <strong>{FIXED_INTEREST_RATE.toFixed(1)}%</strong>
            </div>

            <p className="finance-fixed-rate-note">
              Esta simulacao utiliza uma TAN fixa de{" "}
              <strong>{FIXED_INTEREST_RATE.toFixed(1)}%</strong>.
            </p>
          </div>

          <div className="finance-results">
            {resultItems.map(([label, value]) => (
              <div className="finance-result" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
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
              {financeBenefits.map((benefit) => (
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
              ))}
            </div>
          </section>

          <section className="finance-card finance-card--request">
            <h2>Pedir Financiamento</h2>
            <p className="finance-request-copy">
              Envie o pedido com a simulacao atual e a nossa equipa entra em
              contacto consigo para apresentar as condicoes finais.
            </p>

            <div className="finance-request-summary" aria-label="Resumo da simulacao">
              {requestSummaryItems.map(([label, value]) => (
                <article className="finance-request-summary__item" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
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
                    onChange={handleVehicleSelect}
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
