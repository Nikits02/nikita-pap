import {
  FormInputField,
  FormSelectField,
} from "../../../shared/components/form/FormField";
import AdminPageShell from "./AdminPageShell";
import AdminSectionLinks from "./AdminSectionLinks";

const adminLeadStatusClasses = {
  accepted: "admin-lead-card__status--accepted",
  cancelled: "admin-lead-card__status--cancelled",
  rejected: "admin-lead-card__status--rejected",
  responded: "admin-lead-card__status--responded",
  scheduled: "admin-lead-card__status--scheduled",
};

function getAdminLeadStatusClass(status) {
  return [
    "admin-lead-card__status",
    adminLeadStatusClasses[status.value],
  ]
    .filter(Boolean)
    .join(" ");
}

export function AdminRecordsPage({
  title,
  currentSection,
  isLoading,
  error,
  records,
  filteredRecords,
  notice = "",
  loadingText,
  emptyText,
  filteredEmptyText,
  searchTerm,
  onSearchTermChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  countText,
  renderRecord,
}) {
  const hasStatusFilter = statusOptions.length > 0;

  return (
    <AdminPageShell
      title={title}
      showLogout
      showBackToSite
      actions={<AdminSectionLinks current={currentSection} />}
    >
      {isLoading ? (
        <p className="admin-page__text">{loadingText}</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : records.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">{emptyText}</p>
        </div>
      ) : (
        <div className="admin-leads">
          {notice ? <p className="admin-page__notice">{notice}</p> : null}

          <div
            className={`admin-filters${hasStatusFilter ? "" : " admin-filters--single"}`}
          >
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder={searchPlaceholder}
            />

            {hasStatusFilter ? (
              <FormSelectField
                className="admin-form__field"
                label="Estado"
                value={statusFilter}
                onChange={(event) => onStatusFilterChange(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelectField>
            ) : null}
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {countText}
          </p>

          {filteredRecords.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">{filteredEmptyText}</p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredRecords.map(renderRecord)}
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export function AdminLeadCard({
  eyebrow,
  title,
  timestamp,
  status,
  metaItems,
  notes = null,
  manage = null,
  actions = null,
}) {
  return (
    <article className="admin-lead-card">
      <div className="admin-lead-card__header">
        <div>
          <p className="admin-lead-card__eyebrow">{eyebrow}</p>
          <h2 className="admin-lead-card__title">{title}</h2>
        </div>

        {status ? (
          <div className="admin-lead-card__header-side">
            <span className={getAdminLeadStatusClass(status)}>
              {status.label}
            </span>
            <p className="admin-lead-card__timestamp">{timestamp}</p>
          </div>
        ) : (
          <p className="admin-lead-card__timestamp">{timestamp}</p>
        )}
      </div>

      <dl className="admin-lead-card__meta">
        {metaItems.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {notes ? (
        <div className="admin-lead-card__notes">
          <h3>{notes.title}</h3>
          <p>{notes.text}</p>
        </div>
      ) : null}

      {manage ? <div className="admin-lead-card__manage">{manage}</div> : null}
      {actions ? <div className="admin-lead-card__actions">{actions}</div> : null}
    </article>
  );
}

export function AdminStatusSelect({
  value,
  options,
  disabled,
  onChange,
  label = "Decisão",
}) {
  const hasSelectedValue = options.some((option) => option.value === value);

  return (
    <FormSelectField
      className="admin-form__field"
      label={label}
      value={hasSelectedValue ? value : ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="" disabled>
        Escolher decisão
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FormSelectField>
  );
}

export function AdminDeleteButton({ disabled, onClick }) {
  return (
    <button
      className="admin-button admin-button--danger"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? "A eliminar..." : "Eliminar"}
    </button>
  );
}
