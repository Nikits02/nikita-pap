import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormError, FormInputField } from "../../components/form/FormField";
import {
  CalendarCardIcon,
  CarSilhouetteIcon,
  CheckCircleIcon,
} from "../../components/icons/CommonIcons";
import PageHero from "../../components/PageHero";
import SitePage from "../../components/SitePage";
import TestDriveHourSelector from "../../components/test-drive/TestDriveHourSelector";
import TestDrivePersonalFields from "../../components/test-drive/TestDrivePersonalFields";
import useFormState from "../../hooks/useFormState";
import useVehicles from "../../hooks/useVehicles";
import { createTestDrive } from "../../services/api";
import { getTodayDateString } from "../../utils/date";
import { getVehicleLabel } from "../../utils/vehicle";

const initialForm = {
  vehicleSlug: "",
  dataPreferida: "",
  horaPreferida: "",
  nome: "",
  telefone: "",
  email: "",
};

function TestDrive() {
  const [searchParams] = useSearchParams();
  const { vehicles, isLoading, error: vehicleError } = useVehicles();
  const scheduleSectionRef = useRef(null);
  const dateFieldRef = useRef(null);
  const requestedVehicle = searchParams.get("veiculo") ?? "";
  const { formData, updateField: updateFormField } = useFormState(() => ({
    ...initialForm,
    vehicleSlug: requestedVehicle,
  }));
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = useMemo(() => getTodayDateString(), []);
  const orderedVehicles = useMemo(
    () =>
      [...vehicles].sort(
        (firstVehicle, secondVehicle) =>
          secondVehicle.preco - firstVehicle.preco,
      ),
    [vehicles],
  );
  const selectedVehicle =
    orderedVehicles.find((vehicle) => vehicle.slug === formData.vehicleSlug) ??
    null;

  function updateField(field, value) {
    if (formError) {
      setFormError("");
    }

    updateFormField(field, value);
  }

  function handleVehicleSelect(vehicleSlug) {
    updateField("vehicleSlug", vehicleSlug);

    window.requestAnimationFrame(() => {
      scheduleSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        dateFieldRef.current?.focus();
      }, 250);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.vehicleSlug) {
      setFormError("Selecione uma viatura para o teste drive.");
      return;
    }

    if (!formData.horaPreferida) {
      setFormError("Selecione uma hora preferida para o teste drive.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createTestDrive({
        ...formData,
        vehicleLabel: selectedVehicle ? getVehicleLabel(selectedVehicle) : "",
      });
      setSubmitted(true);
    } catch (submitError) {
      setFormError(
        submitError.message ?? "Nao foi possivel guardar o agendamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SitePage mainClassName="page-shell test-drive-page">
      <PageHero
        baseClassName="test-drive-hero"
        title="Teste Drive"
        description="Escolha a viatura, indique a sua data e hora preferidas e deixe os seus dados para confirmarmos o agendamento."
        kicker="Agendamento"
        kickerClassName="test-drive-hero__kicker"
      />

      <section className="test-drive-layout">
        {submitted ? (
          <div className="test-drive-success">
            <div className="test-drive-success__icon">
              <CheckCircleIcon />
            </div>
            <h2>Agendamento enviado!</h2>
            <p>
              Recebemos o seu pedido para{" "}
              <strong>
                {selectedVehicle
                  ? getVehicleLabel(selectedVehicle)
                  : "o teste drive"}
              </strong>
              .
            </p>
            <p>
              Vamos entrar em contacto para confirmar a data{" "}
              <strong>{formData.dataPreferida}</strong> e a hora{" "}
              <strong>{formData.horaPreferida}</strong>.
            </p>
          </div>
        ) : (
          <form className="test-drive-form" onSubmit={handleSubmit}>
            <section className="test-drive-step">
              <div className="test-drive-step__heading">
                <span className="test-drive-step__icon">
                  <CarSilhouetteIcon />
                </span>
                <h2>1. Escolha o Veiculo</h2>
              </div>

              <div className="test-drive-vehicle-grid">
                {isLoading ? <p>A carregar viaturas...</p> : null}
                {!isLoading && vehicleError ? <p>{vehicleError}</p> : null}
                {!isLoading && !vehicleError
                  ? orderedVehicles.map((vehicle) => {
                      const isSelected = vehicle.slug === formData.vehicleSlug;

                      return (
                        <button
                          key={vehicle.slug}
                          className={`test-drive-vehicle-card${isSelected ? " is-selected" : ""}`}
                          type="button"
                          onClick={() => handleVehicleSelect(vehicle.slug)}
                        >
                          <div className="test-drive-vehicle-card__media">
                            <img
                              src={vehicle.imagem}
                              alt={getVehicleLabel(vehicle)}
                            />
                          </div>

                          <div className="test-drive-vehicle-card__body">
                            <p>{vehicle.marca}</p>
                            <h3>{vehicle.modelo}</h3>
                            <span>
                              {vehicle.ano} | {vehicle.potencia ?? "Sob consulta"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  : null}
              </div>
            </section>

            <section className="test-drive-step" ref={scheduleSectionRef}>
              <div className="test-drive-step__heading">
                <span className="test-drive-step__icon">
                  <CalendarCardIcon />
                </span>
                <h2>2. Data e Hora</h2>
              </div>

              <div className="test-drive-schedule">
                <FormInputField
                  className="test-drive-field"
                  label="Data Preferida *"
                  type="date"
                  min={todayDate}
                  value={formData.dataPreferida}
                  inputRef={dateFieldRef}
                  onChange={(event) =>
                    updateField("dataPreferida", event.target.value)
                  }
                  required
                />

                <TestDriveHourSelector
                  fieldClassName="test-drive-field"
                  value={formData.horaPreferida}
                  onChange={(hour) => updateField("horaPreferida", hour)}
                  buttonClassName="test-drive-hours__button"
                />
              </div>
            </section>

            <section className="test-drive-step">
              <div className="test-drive-step__heading">
                <span className="test-drive-step__number">3</span>
                <h2>3. Dados Pessoais</h2>
              </div>

              <TestDrivePersonalFields
                gridClassName="test-drive-personal-grid"
                fieldClassName="test-drive-field"
                values={formData}
                onChange={updateField}
              />
            </section>

            <FormError className="test-drive-form__error" message={formError} />

            <button
              className="test-drive-submit"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              <CheckCircleIcon />
              <span>{isSubmitting ? "A enviar..." : "Confirmar Agendamento"}</span>
            </button>
          </form>
        )}
      </section>
    </SitePage>
  );
}

export default TestDrive;
