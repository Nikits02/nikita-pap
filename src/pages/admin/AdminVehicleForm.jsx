import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import { FormError, FormField } from "../../components/form/FormField";
import { adminVehicleFields } from "../../data/adminVehicleFields";
import useFormState from "../../hooks/useFormState";
import {
  createAdminVehicle,
  fetchAdminVehicle,
  uploadAdminVehicleImage,
  updateAdminVehicle,
} from "../../services/adminApi";
import { clearAuthSession } from "../../services/authApi";
import { formatDateForInput, getTodayDateString } from "../../utils/date";
import { formatFileSize, readFileAsDataUrl } from "../../utils/file";

const ADMIN_VEHICLES_PATH = "/admin/viaturas";
const ADMIN_LOGIN_PATH = "/admin/login";
const VEHICLE_IMAGE_FIELD = adminVehicleFields.find(
  ({ name }) => name === "imagem",
);
const ADMIN_VEHICLE_MAIN_FIELDS = adminVehicleFields.filter(
  ({ name }) => name !== "imagem",
);
const VEHICLE_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp";
const VEHICLE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const SUPPORTED_VEHICLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const initialForm = {
  source: "catalog",
  marca: "",
  modelo: "",
  tipo: "",
  versao: "",
  preco: "",
  ano: "",
  potencia: "",
  quilometragem: "",
  combustivel: "",
  caixa: "",
  inserted_at: getTodayDateString(),
  novidade: false,
  imagem: "",
};

function mapVehicleToForm(vehicle) {
  return {
    source:
      vehicle.source === "stock" ? "catalog" : vehicle.source ?? "catalog",
    marca: vehicle.marca ?? "",
    modelo: vehicle.modelo ?? "",
    tipo: vehicle.tipo ?? "",
    versao: vehicle.versao ?? "",
    preco: vehicle.preco != null ? String(vehicle.preco) : "",
    ano: vehicle.ano != null ? String(vehicle.ano) : "",
    potencia: vehicle.potencia ?? "",
    quilometragem: vehicle.quilometragem ?? "",
    combustivel: vehicle.combustivel ?? "",
    caixa: vehicle.caixa ?? "",
    inserted_at: formatDateForInput(vehicle.inserted_at),
    novidade: Boolean(vehicle.novidade),
    imagem: vehicle.imagem ?? "",
  };
}

function buildPayload(formData, defaultInsertedAt = null) {
  return {
    source: formData.source,
    marca: formData.marca.trim(),
    modelo: formData.modelo.trim(),
    tipo: formData.tipo.trim() || null,
    versao: formData.versao.trim() || null,
    preco: Number(formData.preco),
    ano: formData.ano ? Number(formData.ano) : null,
    potencia: formData.potencia.trim() || null,
    quilometragem: formData.quilometragem.trim() || null,
    combustivel: formData.combustivel.trim(),
    caixa: formData.caixa.trim(),
    inserted_at: formData.inserted_at || defaultInsertedAt,
    novidade: formData.novidade,
    imagem: formData.imagem.trim(),
  };
}

function getVehicleImageSelectionError(file) {
  if (!file) {
    return "Seleciona uma imagem antes de carregar.";
  }

  if (!SUPPORTED_VEHICLE_IMAGE_TYPES.has(file.type)) {
    return "Formato invalido. Usa JPG, PNG ou WEBP.";
  }

  if (file.size > VEHICLE_IMAGE_MAX_BYTES) {
    return "A imagem nao pode ter mais de 5 MB.";
  }

  return "";
}

function AdminVehicleInput({ field, value, onChange }) {
  if (field.control === "select") {
    return (
      <FormField
        className="admin-form__field"
        label={field.label}
        hint={field.hint}
        hintClassName="admin-form__hint"
      >
        <select
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  return (
    <FormField
      className="admin-form__field"
      label={field.label}
      hint={field.hint}
      hintClassName="admin-form__hint"
    >
      <input
        type={field.type}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.name, event.target.value)}
        required={field.required}
      />
    </FormField>
  );
}

function AdminVehicleImageField({
  value,
  onChange,
  previewUrl,
  uploadError,
  isUploading,
  onFileChange,
  selectedImageLabel,
}) {
  return (
    <div className="admin-form__upload">
      <FormField
        className="admin-form__field admin-form__field--full"
        label="Carregar imagem"
        hint='Escolhe um ficheiro JPG, PNG ou WEBP. O upload preenche o campo "Imagem" automaticamente.'
        hintClassName="admin-form__hint"
      >
        <div className="admin-form__upload-row">
          <input
            className="admin-form__file-input"
            type="file"
            accept={VEHICLE_IMAGE_ACCEPT}
            onChange={onFileChange}
          />

          {isUploading ? (
            <span className="admin-form__upload-status">A carregar imagem...</span>
          ) : null}
        </div>

        {selectedImageLabel ? (
          <p className="admin-form__upload-note">{selectedImageLabel}</p>
        ) : null}

        <FormError className="admin-form__error" message={uploadError} />
      </FormField>

      <FormField
        className="admin-form__field admin-form__field--full"
        label={VEHICLE_IMAGE_FIELD?.label ?? "Imagem *"}
        hint={VEHICLE_IMAGE_FIELD?.hint}
        hintClassName="admin-form__hint"
      >
        <input
          type="text"
          value={value}
          placeholder={VEHICLE_IMAGE_FIELD?.placeholder}
          onChange={(event) => onChange("imagem", event.target.value)}
          required
        />
      </FormField>

      {previewUrl ? (
        <div className="admin-form__preview">
          <p className="admin-form__preview-label">Pre-visualizacao</p>
          <img
            className="admin-form__preview-image"
            src={previewUrl}
            alt="Pre-visualizacao da viatura"
          />
        </div>
      ) : null}
    </div>
  );
}

function AdminVehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { formData, setFormData, updateField: updateFormField } =
    useFormState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedImageLabel, setSelectedImageLabel] = useState("");

  function updateField(field, value) {
    if (error) {
      setError("");
    }

    if (field === "imagem") {
      setImagePreviewUrl("");
      setSelectedImageLabel("");
      setImageUploadError("");
    }

    updateFormField(field, value);
  }

  async function handleImageFileChange(event) {
    const file = event.target.files?.[0];
    const fileInput = event.target;
    const fileSelectionError = getVehicleImageSelectionError(file);

    if (error) {
      setError("");
    }

    setImageUploadError("");

    if (fileSelectionError) {
      setImageUploadError(fileSelectionError);
      fileInput.value = "";
      return;
    }

    try {
      setIsUploadingImage(true);
      setSelectedImageLabel(`${file.name} (${formatFileSize(file.size)})`);

      const dataUrl = await readFileAsDataUrl(file);
      setImagePreviewUrl(dataUrl);

      const uploadedImage = await uploadAdminVehicleImage({
        fileName: file.name,
        dataUrl,
      });

      updateFormField("imagem", uploadedImage.imagem);
      setImagePreviewUrl(uploadedImage.imagem);
      setSelectedImageLabel(`Imagem carregada: ${file.name}`);
    } catch (uploadError) {
      setImageUploadError(
        uploadError.message ?? "Nao foi possivel carregar a imagem.",
      );
    } finally {
      setIsUploadingImage(false);
      fileInput.value = "";
    }
  }

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    let isMounted = true;

    async function loadVehicle() {
      try {
        setIsLoading(true);
        const vehicle = await fetchAdminVehicle(id);

        if (isMounted) {
          setFormData(mapVehicleToForm(vehicle));
          setImagePreviewUrl(vehicle.imagem ?? "");
          setSelectedImageLabel("");
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (loadError.message === "Sessao expirada.") {
          clearAuthSession();
          navigate(ADMIN_LOGIN_PATH, {
            replace: true,
            state: {
              notice: "Sessao expirada. Inicie sessao novamente para continuar.",
            },
          });
          return;
        }

        setError(loadError.message ?? "Nao foi possivel carregar a viatura.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, navigate, setFormData]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isUploadingImage) {
      setError("Espera que a imagem termine de carregar.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = buildPayload(
        formData,
        isEditMode ? null : getTodayDateString(),
      );

      if (isEditMode) {
        await updateAdminVehicle(id, payload);
      } else {
        await createAdminVehicle(payload);
      }

      navigate(ADMIN_VEHICLES_PATH);
    } catch (submitError) {
      if (submitError.message === "Sessao expirada.") {
        clearAuthSession();
        navigate(ADMIN_LOGIN_PATH, {
          replace: true,
          state: {
            notice: "Sessao expirada. Inicie sessao novamente para continuar.",
          },
        });
        return;
      }

      setError(submitError.message ?? "Nao foi possivel guardar a viatura.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageShell
      title={isEditMode ? "Editar Viatura" : "Nova Viatura"}
      showLogout
      showBackToSite
      actions={
        <button
          className="admin-button admin-button--secondary"
          type="button"
          onClick={() => navigate(ADMIN_VEHICLES_PATH)}
        >
          Voltar ao painel
        </button>
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar dados da viatura...</p>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <p className="admin-page__text admin-page__text--muted">
            Preenche os campos com os dados da viatura. Os obrigatorios estao
            assinalados com * e os exemplos dentro dos campos mostram o formato
            esperado.
          </p>

          <div className="admin-form__grid">
            {ADMIN_VEHICLE_MAIN_FIELDS.map((field) => (
              <AdminVehicleInput
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={updateField}
              />
            ))}
          </div>

          <AdminVehicleImageField
            value={formData.imagem}
            onChange={updateField}
            previewUrl={imagePreviewUrl || formData.imagem}
            uploadError={imageUploadError}
            isUploading={isUploadingImage}
            onFileChange={handleImageFileChange}
            selectedImageLabel={selectedImageLabel}
          />

          <label className="admin-form__checkbox">
            <input
              type="checkbox"
              checked={formData.novidade}
              onChange={(event) => updateField("novidade", event.target.checked)}
            />
            Marcar como novidade
          </label>

          <p className="admin-form__hint">
            Ativa esta opcao se quiseres mostrar a badge "Novo" na viatura.
          </p>

          <FormError className="admin-form__error" message={error} />

          <div className="admin-form__actions">
            <button
              className="admin-button"
              type="submit"
              disabled={isSubmitting || isUploadingImage}
            >
              {isSubmitting
                ? "A guardar..."
                : isEditMode
                  ? "Guardar alteracoes"
                  : "Criar viatura"}
            </button>

            <button
              className="admin-button admin-button--secondary"
              type="button"
              onClick={() => navigate(ADMIN_VEHICLES_PATH)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </AdminPageShell>
  );
}

export default AdminVehicleForm;
