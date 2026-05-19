import { FormError, FormField } from "../../form/FormField";

function AdminVehicleImageField({
  value,
  onChange,
  previewUrl,
  uploadError,
  isUploading,
  onFileChange,
  selectedImageLabel,
  imageField,
  accept,
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
            accept={accept}
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
        label={imageField?.label ?? "Imagem *"}
        hint={imageField?.hint}
        hintClassName="admin-form__hint"
      >
        <input
          type="text"
          value={value}
          placeholder={imageField?.placeholder}
          onChange={(event) => onChange("imagem", event.target.value)}
          required
        />
      </FormField>

      {previewUrl ? (
        <div className="admin-form__preview">
          <p className="admin-form__preview-label">Pré-visualização</p>
          <img
            className="admin-form__preview-image"
            src={previewUrl}
            alt="Pré-visualização da viatura"
          />
        </div>
      ) : null}
    </div>
  );
}

export default AdminVehicleImageField;
