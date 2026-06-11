import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomSelect from "../../../shared/components/form/CustomSelect";
import {
  FormError,
  FormField,
  FormInputField,
  FormTextareaField,
} from "../../../shared/components/form/FormField";
import {
  ClockCircleIcon,
  LocationPinIcon,
  MailIcon,
  PaperPlaneIcon,
  PhoneIcon,
} from "../../../shared/components/icons/CommonIcons";
import TypedIcon from "../../../shared/components/icons/TypedIcon";
import { PageHero, SitePage } from "../../../shared/components/ui";
import useFormState from "../../../shared/hooks/useFormState";
import useSubmitState from "../../../shared/hooks/useSubmitState";
import {
  contactInfoItems,
  contactSubjectOptions,
  initialContactForm,
} from "../data/contact";
import { createContactMessage } from "../services/contactApi";

const contactInfoIcons = {
  clock: ClockCircleIcon,
  location: LocationPinIcon,
  mail: MailIcon,
  phone: PhoneIcon,
};

function buildInitialForm(assuntoParam) {
  return {
    ...initialContactForm,
    assunto: assuntoParam,
  };
}

function getValidSubjectParam(searchParams) {
  const subjectParam = searchParams.get("assunto") ?? "";
  const hasValidSubject = contactSubjectOptions.some(
    (option) => option.value === subjectParam,
  );

  return hasValidSubject ? subjectParam : "";
}

function Contacto() {
  const [searchParams] = useSearchParams();
  const assuntoParam = getValidSubjectParam(searchParams);
  const { formData, updateField: updateFormField } = useFormState(() =>
    buildInitialForm(assuntoParam),
  );
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");
  const {
    error: submitError,
    isSubmitting,
    clearError: clearSubmitError,
    runSubmit,
  } = useSubmitState("Não foi possível enviar a mensagem.");

  function updateField(field, value) {
    if (contactError) {
      setContactError("");
    }

    if (submitError) {
      clearSubmitError();
    }

    updateFormField(field, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.assunto) {
      setContactError("Selecione um assunto antes de enviar a mensagem.");
      return;
    }

    await runSubmit(async () => {
      await createContactMessage({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
      });

      setSubmitted(true);
    });
  }

  return (
    <SitePage mainClassName="page-shell contact-page">
      <PageHero title="Contacto" description="Estamos aqui para si" />

      <section className="contact-page__layout">
        <aside className="contact-info-panel">
          <div className="contact-info-list">
            {contactInfoItems.map((item) => (
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
            ))}
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
              <h2>Mensagem enviada!</h2>
              <p>
                Recebemos o seu pedido e vamos responder com a maior brevidade.
              </p>
            </div>
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
                onChange={(event) =>
                  updateField("mensagem", event.target.value)
                }
                required
              />

              <FormError
                className="contact-field__error"
                message={submitError}
              />

              <button
                className="contact-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <PaperPlaneIcon />
                <span>{isSubmitting ? "A enviar..." : "ENVIAR MENSAGEM"}</span>
              </button>
            </form>
          )}
        </section>
      </section>
    </SitePage>
  );
}

export default Contacto;
