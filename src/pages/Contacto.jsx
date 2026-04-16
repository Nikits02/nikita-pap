import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomSelect from "../components/form/CustomSelect";
import {
  FormError,
  FormField,
  FormInputField,
  FormTextareaField,
} from "../components/form/FormField";
import {
  ClockCircleIcon,
  LocationPinIcon,
  MailIcon,
  PaperPlaneIcon,
  PhoneIcon,
} from "../components/icons/CommonIcons";
import TypedIcon from "../components/icons/TypedIcon";
import {
  contactInfoItems,
  contactSubjectOptions,
  initialContactForm,
} from "../data/contact";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import TestDriveHourSelector from "../components/test-drive/TestDriveHourSelector";
import TestDrivePersonalFields from "../components/test-drive/TestDrivePersonalFields";
import useFormState from "../hooks/useFormState";
import { createContactMessage, createTestDrive } from "../services/api";
import { getTodayDateString } from "../utils/date";

const contactInfoIcons = {
  clock: ClockCircleIcon,
  location: LocationPinIcon,
  mail: MailIcon,
  phone: PhoneIcon,
};

function buildInitialForm(assuntoParam, veiculoParam) {
  return {
    ...initialContactForm,
    assunto: assuntoParam,
    mensagem: veiculoParam
      ? `Gostaria de agendar um teste drive para a viatura ${veiculoParam}.`
      : "",
  };
}

function Contacto() {
  const [searchParams] = useSearchParams();
  const assuntoParam = searchParams.get("assunto") ?? "";
  const veiculoParam = searchParams.get("veiculo") ?? "";
  const isTestDriveFlow =
    assuntoParam === "Pedido de Test Drive" || Boolean(veiculoParam);
  const { formData, updateField: updateFormField } = useFormState(() =>
    buildInitialForm(assuntoParam, veiculoParam),
  );
  const [submitted, setSubmitted] = useState(false);
  const [testDriveError, setTestDriveError] = useState("");
  const [contactError, setContactError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayDate] = useState(() => getTodayDateString());

  function updateField(field, value) {
    if (field === "horaPreferida") {
      setTestDriveError("");
    }

    if (contactError) {
      setContactError("");
    }

    if (submitError) {
      setSubmitError("");
    }

    updateFormField(field, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isTestDriveFlow && !formData.horaPreferida) {
      setTestDriveError("Selecione uma hora preferida para o teste drive.");
      return;
    }

    if (!isTestDriveFlow && !formData.assunto) {
      setContactError("Selecione um assunto antes de enviar a mensagem.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isTestDriveFlow) {
        await createTestDrive({
          vehicleSlug: veiculoParam || "contacto-test-drive",
          vehicleLabel: veiculoParam || "Teste Drive",
          dataPreferida: formData.dataPreferida,
          horaPreferida: formData.horaPreferida,
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
        });
      } else {
        await createContactMessage({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
        });
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message ??
          (isTestDriveFlow
            ? "Nao foi possivel enviar o pedido de teste drive."
            : "Nao foi possivel enviar a mensagem."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SitePage mainClassName="page-shell contact-page">
      <PageHero title="Contacto" description="Estamos aqui para si" />

      <section className="contact-page__layout">
        <aside className="contact-info-panel">
          <div className="contact-info-list">
            {contactInfoItems.map((item) => {
              return (
                <article className="contact-info-item" key={item.title}>
                  <div className="contact-info-item__icon">
                    <TypedIcon
                      type={item.icon}
                      icons={contactInfoIcons}
                      fallback={ClockCircleIcon}
                    />
                  </div>
                  <div>
                    <span>{item.title}</span>
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </article>
              );
            })}
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
              <LocationPinIcon />
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
                <PaperPlaneIcon />
              </div>
              <h2>
                {isTestDriveFlow
                  ? "Agendamento enviado!"
                  : "Mensagem enviada!"}
              </h2>
              <p>
                {isTestDriveFlow
                  ? "Recebemos o seu pedido de teste drive e vamos entrar em contacto para confirmar a data e a hora escolhidas."
                  : "Recebemos o seu pedido e vamos responder com a maior brevidade."}
              </p>
            </div>
          ) : isTestDriveFlow ? (
            <form
              className="contact-form contact-form--test-drive"
              onSubmit={handleSubmit}
            >
              <div className="test-drive-intro">
                <p className="test-drive-intro__kicker">Pedido de Test Drive</p>
                <h2>{veiculoParam || "Agende o seu Teste Drive"}</h2>
                <p>
                  Escolha a data, a hora e deixe os seus dados para confirmarmos
                  o agendamento consigo.
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
                  <FormInputField
                    className="contact-field"
                    label="Data Preferida *"
                    type="date"
                    min={todayDate}
                    value={formData.dataPreferida}
                    onChange={(event) =>
                      updateField("dataPreferida", event.target.value)
                    }
                    required
                  />

                  <TestDriveHourSelector
                    fieldClassName="contact-field"
                    value={formData.horaPreferida}
                    onChange={(hour) => updateField("horaPreferida", hour)}
                    buttonClassName="test-drive-hours__option"
                    error={testDriveError}
                    errorClassName="test-drive-hours__error"
                  />
                </div>
              </section>

              <section className="test-drive-section">
                <div className="test-drive-section__header">
                  <span className="test-drive-section__step">2</span>
                  <h3>Dados Pessoais</h3>
                </div>

                <TestDrivePersonalFields
                  gridClassName="contact-form__grid contact-form__grid--test-drive"
                  fieldClassName="contact-field"
                  values={formData}
                  onChange={updateField}
                />
              </section>

              <input type="hidden" value={formData.assunto} readOnly />
              <input type="hidden" value={formData.mensagem} readOnly />

              <button
                className="contact-submit test-drive-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <PaperPlaneIcon />
                <span>{isSubmitting ? "A enviar..." : "Confirmar Agendamento"}</span>
              </button>
            </form>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__grid">
                <FormInputField
                  className="contact-field"
                  label="Nome *"
                  type="text"
                  value={formData.nome}
                  onChange={(event) => updateField("nome", event.target.value)}
                  required
                />

                <FormInputField
                  className="contact-field"
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />

                <FormInputField
                  className="contact-field"
                  label="Telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(event) =>
                    updateField("telefone", event.target.value)
                  }
                />

                <FormField
                  className="contact-field"
                  label="Assunto *"
                  error={contactError}
                  errorClassName="contact-field__error"
                >
                  <CustomSelect
                    value={formData.assunto}
                    options={contactSubjectOptions}
                    placeholder="-"
                    onChange={(value) => updateField("assunto", value)}
                    rootClassName="contact-select"
                    triggerClassName="contact-select__trigger"
                    menuClassName="contact-select__menu"
                    optionClassName="contact-select__option"
                  />
                </FormField>
              </div>

              <FormTextareaField
                className="contact-field contact-field--full"
                label="Mensagem *"
                rows="7"
                value={formData.mensagem}
                onChange={(event) => updateField("mensagem", event.target.value)}
                required
              />

              <FormError className="contact-field__error" message={submitError} />

              <button
                className="contact-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <PaperPlaneIcon />
                <span>{isSubmitting ? "A enviar..." : "Enviar Mensagem"}</span>
              </button>
            </form>
          )}
        </section>
      </section>
    </SitePage>
  );
}

export default Contacto;
