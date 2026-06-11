import { useState } from "react";
import CustomSelect from "../../../shared/components/form/CustomSelect";
import {
  FormError,
  FormField,
  FormInputField,
  FormTextareaField,
} from "../../../shared/components/form/FormField";
import {
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClipboardIcon,
  SearchLensIcon,
} from "../../../shared/components/icons/CommonIcons";
import TypedIcon from "../../../shared/components/icons/TypedIcon";
import { PageHero, SitePage } from "../../../shared/components/ui";
import {
  tradeInSteps,
  tradeInVehicleConditionOptions,
} from "../data/tradeIn";
import useFormState from "../../../shared/hooks/useFormState";
import useSubmitState from "../../../shared/hooks/useSubmitState";
import { createTradeInRequest } from "../services/tradeInApi";

const currentYear = new Date().getFullYear();
const MAX_TRADE_IN_MILEAGE = 150000;
const MAX_TRADE_IN_MILEAGE_MESSAGE =
  "Só aceitamos veículos até 150 000 km.";

function CarStepIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 15.5h10l1.2-3.2a1.4 1.4 0 0 0-1.3-1.9H7.1a1.4 1.4 0 0 0-1.3.9L4.6 15.5H7Z" />
      <path d="M5.5 15.5h13a1 1 0 0 1 1 1v1h-2v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2H9v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2h-2v-1a1 1 0 0 1 1-1Z" />
      <circle cx="8" cy="16.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const stepIcons = {
  car: CarStepIcon,
  check: ClipboardCheckIcon,
  clipboard: ClipboardIcon,
  search: SearchLensIcon,
};

function Retoma() {
  const { formData, updateField: updateFormField } = useFormState({
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
  const [vehicleConditionError, setVehicleConditionError] = useState("");
  const [mileageError, setMileageError] = useState("");
  const {
    error: submitError,
    isSubmitting,
    clearError: clearSubmitError,
    runSubmit,
  } = useSubmitState("Não foi possível enviar o pedido de retoma.");

  function updateField(field, value) {
    if (field === "estado" && vehicleConditionError) {
      setVehicleConditionError("");
    }

    if (field === "quilometragem") {
      const mileage = Number(value);
      setMileageError(
        mileage > MAX_TRADE_IN_MILEAGE ? MAX_TRADE_IN_MILEAGE_MESSAGE : "",
      );
    }

    if (submitError) {
      clearSubmitError();
    }

    updateFormField(
      field,
      field === "ano" || field === "quilometragem" ? Number(value) : value,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.estado) {
      setVehicleConditionError("Selecione o estado geral da viatura.");
      return;
    }

    if (formData.quilometragem > MAX_TRADE_IN_MILEAGE) {
      setMileageError(MAX_TRADE_IN_MILEAGE_MESSAGE);
      return;
    }

    await runSubmit(async () => {
      await createTradeInRequest(formData);
      setSubmitted(true);
    });
  }

  return (
    <SitePage mainClassName="page-shell tradein-page">
      <PageHero
        className="tradein-hero"
        title="Avaliação de Retoma"
        description="Avalie o seu veículo atual e receba uma proposta justa"
      />

      <section className="tradein-process">
        <h2>Como Funciona</h2>

        <div className="tradein-process__grid">
          {tradeInSteps.map((step) => (
            <article className="tradein-step" key={step.number}>
              <div className="tradein-step__visual">
                <div className="tradein-step__icon">
                  <TypedIcon
                    type={step.icon}
                    icons={stepIcons}
                    fallback={ClipboardCheckIcon}
                  />
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
              <CheckCircleIcon />
            </div>
            <h2>Pedido Recebido!</h2>
            <p>
              A nossa equipa irá analisar os dados do seu veículo e entrar em
              contacto em breve com uma estimativa de avaliação.
            </p>
          </div>
        ) : (
          <form className="tradein-form-card" onSubmit={handleSubmit}>
            <div className="tradein-section-heading">
              <h2>Dados do Veículo</h2>
            </div>

            <div className="tradein-form-grid tradein-form-grid--vehicle">
              <FormInputField
                className="tradein-field"
                label="Marca *"
                type="text"
                value={formData.marca}
                onChange={(event) => updateField("marca", event.target.value)}
                placeholder="ex: Mercedes-Benz"
                required
              />

              <FormInputField
                className="tradein-field"
                label="Modelo *"
                type="text"
                value={formData.modelo}
                onChange={(event) => updateField("modelo", event.target.value)}
                placeholder="ex: C 300"
                required
              />

              <FormInputField
                className="tradein-field"
                label="Ano *"
                type="number"
                min="1990"
                max={currentYear}
                value={formData.ano}
                onChange={(event) => updateField("ano", event.target.value)}
                required
              />

              <FormInputField
                className="tradein-field"
                label="Quilómetros *"
                type="number"
                min="0"
                max={MAX_TRADE_IN_MILEAGE}
                value={formData.quilometragem}
                onChange={(event) =>
                  updateField("quilometragem", event.target.value)
                }
                error={mileageError}
                errorClassName="tradein-field__error"
                required
              />

              <FormField
                className="tradein-field"
                label="Estado Geral *"
                error={vehicleConditionError}
                errorClassName="tradein-field__error"
              >
                <CustomSelect
                  value={formData.estado}
                  options={tradeInVehicleConditionOptions}
                  placeholder="-"
                  onChange={(value) => updateField("estado", value)}
                  rootClassName="tradein-select"
                  triggerClassName="tradein-select__trigger"
                  menuClassName="tradein-select__menu"
                  optionClassName="tradein-select__option"
                />
              </FormField>
            </div>

            <div className="tradein-section-heading tradein-section-heading--contact">
              <h2>Dados de Contacto</h2>
            </div>

            <div className="tradein-form-grid tradein-form-grid--contact">
              <FormInputField
                className="tradein-field"
                label="Nome Completo *"
                type="text"
                value={formData.nome}
                onChange={(event) => updateField("nome", event.target.value)}
                required
              />

              <FormInputField
                className="tradein-field"
                label="Telefone *"
                type="tel"
                value={formData.telefone}
                onChange={(event) =>
                  updateField("telefone", event.target.value)
                }
                required
              />

              <FormInputField
                className="tradein-field tradein-field--full"
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />

              <FormTextareaField
                className="tradein-field tradein-field--full"
                label="Observações"
                rows="5"
                value={formData.observacoes}
                onChange={(event) =>
                  updateField("observacoes", event.target.value)
                }
                placeholder="Informações adicionais sobre o veículo..."
              />
            </div>

            <FormError className="tradein-form-error" message={submitError} />

            <button
              className="tradein-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "A enviar..." : "SOLICITAR AVALIAÇÃO"}
            </button>
          </form>
        )}
      </section>
    </SitePage>
  );
}

export default Retoma;
