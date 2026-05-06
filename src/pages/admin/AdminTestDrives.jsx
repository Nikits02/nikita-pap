import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
} from "../../components/form/FormField";
import {
  ADMIN_LEAD_STATUS_FILTER_OPTIONS,
  ADMIN_LEAD_STATUS_OPTIONS,
  getAdminLeadStatusLabel,
} from "../../data/adminLeadStatus";
import {
  deleteAdminTestDrive,
  fetchAdminTestDrives,
  updateAdminTestDrive,
} from "../../services/adminApi";
import {
  formatAdminDate,
  formatAdminDateTime,
  handleAdminSessionError,
} from "../../utils/admin";

function formatTestDriveHour(value) {
  return value ? String(value).slice(0, 5) : "-";
}

function getLeadStatus(value) {
  return value || "new";
}

function AdminTestDrives() {
  const navigate = useNavigate();
  const [testDrives, setTestDrives] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTestDriveId, setDeletingTestDriveId] = useState(null);
  const [updatingTestDriveId, setUpdatingTestDriveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draftNotes, setDraftNotes] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function loadTestDrives() {
      try {
        setIsLoading(true);
        const loadedTestDrives = await fetchAdminTestDrives();

        if (isMounted) {
          setTestDrives(loadedTestDrives);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(
          loadError.message ?? "Não foi possível carregar os pedidos de test drive.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTestDrives();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleDeleteTestDrive(testDrive) {
    const testDriveLabel =
      testDrive.vehicle_label?.trim() ||
      testDrive.nome?.trim() ||
      `pedido #${testDrive.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${testDriveLabel}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingTestDriveId(testDrive.id);
      setError("");
      await deleteAdminTestDrive(testDrive.id);
      setTestDrives((currentTestDrives) =>
        currentTestDrives.filter(({ id }) => id !== testDrive.id),
      );
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(
        deleteError.message ?? "Não foi possível eliminar o pedido de test drive.",
      );
    } finally {
      setDeletingTestDriveId(null);
    }
  }

  async function handleUpdateTestDrive(testDrive, nextValues = {}) {
    try {
      setUpdatingTestDriveId(testDrive.id);
      setError("");
      setNotice("");

      const updatedTestDrive = await updateAdminTestDrive(testDrive.id, {
        status: nextValues.status ?? getLeadStatus(testDrive.status),
        internalNotes:
          nextValues.internalNotes ??
          draftNotes[testDrive.id] ??
          testDrive.internal_notes ??
          "",
      });

      setTestDrives((currentTestDrives) =>
        currentTestDrives.map((currentTestDrive) =>
          currentTestDrive.id === testDrive.id
            ? updatedTestDrive
            : currentTestDrive,
        ),
      );
      setDraftNotes((currentNotes) => ({
        ...currentNotes,
        [testDrive.id]: updatedTestDrive.internal_notes ?? "",
      }));

      if (["scheduled", "cancelled"].includes(updatedTestDrive.status)) {
        if (updatedTestDrive.notification_email_sent) {
          setNotice("Estado atualizado e email enviado ao cliente.");
        } else if (
          updatedTestDrive.notification_email_skipped_reason ===
          "email-not-configured"
        ) {
          setNotice(
            "Estado atualizado. O email nao foi enviado porque o SMTP ainda nao esta configurado.",
          );
        } else if (updatedTestDrive.notification_email_error) {
          setNotice("Estado atualizado, mas houve erro ao enviar o email.");
        }
      }
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ?? "NÃ£o foi possÃ­vel atualizar o pedido.",
      );
    } finally {
      setUpdatingTestDriveId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTestDrives = testDrives.filter((testDrive) => {
    if (
      statusFilter !== "all" &&
      getLeadStatus(testDrive.status) !== statusFilter
    ) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      testDrive.vehicle_label,
      testDrive.vehicle_slug,
      testDrive.nome,
      testDrive.email,
      testDrive.telefone,
      testDrive.data_preferida,
      formatAdminDate(testDrive.data_preferida),
      testDrive.hora_preferida,
      formatTestDriveHour(testDrive.hora_preferida),
      getAdminLeadStatusLabel(getLeadStatus(testDrive.status)),
      testDrive.internal_notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  return (
    <AdminPageShell
      title="Pedidos de Test Drive"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks current="testDrives" />
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar pedidos de test drive...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : testDrives.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda não existem pedidos de test drive registados.
          </p>
        </div>
      ) : (
        <div className="admin-leads">
          {notice ? <p className="admin-page__notice">{notice}</p> : null}

          <div className="admin-filters">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Viatura, nome, email, telefone, data ou hora"
            />

            <FormSelectField
              className="admin-form__field"
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {ADMIN_LEAD_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredTestDrives.length} de {testDrives.length} pedido
            {testDrives.length === 1 ? "" : "s"} de test drive visive
            {filteredTestDrives.length === 1 ? "l" : "is"}.
          </p>

          {filteredTestDrives.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">
                Nenhum pedido corresponde aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredTestDrives.map((testDrive) => {
                const preferredDate = formatAdminDate(testDrive.data_preferida);
                const preferredHour = formatTestDriveHour(
                  testDrive.hora_preferida,
                );
                const testDriveStatus = getLeadStatus(testDrive.status);
                const noteDraft =
                  draftNotes[testDrive.id] ?? testDrive.internal_notes ?? "";
                const metaItems = [
                  ["Viatura", testDrive.vehicle_label || "-"],
                  ["Slug", testDrive.vehicle_slug ?? "-"],
                  ["Data", preferredDate],
                  ["Hora", preferredHour],
                  ["Nome", testDrive.nome ?? "-"],
                  ["Telefone", testDrive.telefone ?? "-"],
                  ["Email", testDrive.email ?? "-"],
                  ["Recebido em", formatAdminDateTime(testDrive.created_at)],
                ];

                return (
                  <article className="admin-lead-card" key={testDrive.id}>
                    <div className="admin-lead-card__header">
                      <div>
                        <p className="admin-lead-card__eyebrow">
                          Pedido #{testDrive.id}
                        </p>
                        <h2 className="admin-lead-card__title">
                          {testDrive.vehicle_label?.trim() ||
                            testDrive.vehicle_slug ||
                            `Test Drive ${testDrive.id}`}
                        </h2>
                      </div>

                      <div className="admin-lead-card__header-side">
                        <span
                          className={`admin-lead-card__status admin-lead-card__status--${testDriveStatus}`}
                        >
                          {getAdminLeadStatusLabel(testDriveStatus)}
                        </span>
                        <p className="admin-lead-card__timestamp">
                          {formatAdminDateTime(testDrive.created_at)}
                        </p>
                      </div>
                    </div>

                    <dl className="admin-lead-card__meta">
                      {metaItems.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="admin-lead-card__manage">
                      <FormSelectField
                        className="admin-form__field"
                        label="Estado"
                        value={testDriveStatus}
                        disabled={updatingTestDriveId === testDrive.id}
                        onChange={(event) =>
                          handleUpdateTestDrive(testDrive, {
                            status: event.target.value,
                          })
                        }
                      >
                        {ADMIN_LEAD_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FormSelectField>

                      <FormTextareaField
                        className="admin-form__field admin-form__field--full"
                        label="Notas internas"
                        rows="3"
                        value={noteDraft}
                        placeholder="Notas apenas visiveis no painel admin"
                        onChange={(event) =>
                          setDraftNotes((currentNotes) => ({
                            ...currentNotes,
                            [testDrive.id]: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="admin-lead-card__actions">
                      <button
                        className="admin-button admin-button--secondary"
                        type="button"
                        disabled={updatingTestDriveId === testDrive.id}
                        onClick={() => handleUpdateTestDrive(testDrive)}
                      >
                        {updatingTestDriveId === testDrive.id
                          ? "A guardar..."
                          : "Guardar notas"}
                      </button>
                      <button
                        className="admin-button admin-button--danger"
                        type="button"
                        disabled={deletingTestDriveId === testDrive.id}
                        onClick={() => handleDeleteTestDrive(testDrive)}
                      >
                        {deletingTestDriveId === testDrive.id
                          ? "A eliminar..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminTestDrives;
