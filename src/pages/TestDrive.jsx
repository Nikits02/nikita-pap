import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useVehicles from "../hooks/useVehicles";
import { createTestDrive } from "../services/api";

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

const initialForm = {
  vehicleSlug: "",
  dataPreferida: "",
  horaPreferida: "",
  nome: "",
  telefone: "",
  email: "",
};

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 15.5h12l1.2-3.2a1.4 1.4 0 0 0-1.3-1.9H7.1a1.4 1.4 0 0 0-1.3.9L4.6 15.5H6Z" />
      <path d="M5.5 15.5h13a1 1 0 0 1 1 1v1h-2v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2H9v1.2a.8.8 0 0 1-.8.8h-.9a.8.8 0 0 1-.8-.8v-1.2h-2v-1a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5v3M17 4.5v3" />
      <rect x="4.5" y="6.5" width="15" height="13" rx="1.5" />
      <path d="M4.5 10h15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="m8.8 12.1 2.2 2.2 4.4-4.7" />
    </svg>
  );
}

function getTodayDateString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset).toISOString().split("T")[0];
}

function getVehicleLabel(vehicle) {
  return `${vehicle.title} ${vehicle.versao ?? ""}`.replace(/\s+/g, " ").trim();
}

function TestDrive() {
  const [searchParams] = useSearchParams();
  const { vehicles, isLoading, error: vehicleError } = useVehicles();
  const requestedVehicle = searchParams.get("veiculo") ?? "";
  const [formData, setFormData] = useState(() => ({
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

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
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
      await createTestDrive(formData);
      setSubmitted(true);
    } catch (submitError) {
      setFormError(submitError.message ?? "Nao foi possivel guardar o agendamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="page-shell test-drive-page">
        <section className="test-drive-hero">
          <p className="test-drive-hero__kicker">Agendamento</p>
          <h1>Teste Drive</h1>
          <p>
            Escolha a viatura, indique a sua data e hora preferidas e deixe os
            seus dados para confirmarmos o agendamento.
          </p>
        </section>

        <section className="test-drive-layout">
          {submitted ? (
            <div className="test-drive-success">
              <div className="test-drive-success__icon">
                <CheckIcon />
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
                    <CarIcon />
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
                            onClick={() => updateField("vehicleSlug", vehicle.slug)}
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

              <section className="test-drive-step">
                <div className="test-drive-step__heading">
                  <span className="test-drive-step__icon">
                    <CalendarIcon />
                  </span>
                  <h2>2. Data e Hora</h2>
                </div>

                <div className="test-drive-schedule">
                  <label className="test-drive-field">
                    <span>Data Preferida *</span>
                    <input
                      type="date"
                      min={todayDate}
                      value={formData.dataPreferida}
                      onChange={(event) =>
                        updateField("dataPreferida", event.target.value)
                      }
                      required
                    />
                  </label>

                  <div className="test-drive-field">
                    <span>Hora Preferida *</span>
                    <div className="test-drive-hours">
                      {testDriveHours.map((hour) => (
                        <button
                          key={hour}
                          className={`test-drive-hours__button${
                            formData.horaPreferida === hour ? " is-active" : ""
                          }`}
                          type="button"
                          onClick={() => updateField("horaPreferida", hour)}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="test-drive-step">
                <div className="test-drive-step__heading">
                  <span className="test-drive-step__number">3</span>
                  <h2>3. Dados Pessoais</h2>
                </div>

                <div className="test-drive-personal-grid">
                  <label className="test-drive-field">
                    <span>Nome Completo *</span>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(event) =>
                        updateField("nome", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="test-drive-field">
                    <span>Telefone *</span>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(event) =>
                        updateField("telefone", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="test-drive-field">
                    <span>Email *</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      required
                    />
                  </label>
                </div>
              </section>

              {formError ? <p className="test-drive-form__error">{formError}</p> : null}

              <button
                className="test-drive-submit"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                <CheckIcon />
                <span>{isSubmitting ? "A enviar..." : "Confirmar Agendamento"}</span>
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default TestDrive;
