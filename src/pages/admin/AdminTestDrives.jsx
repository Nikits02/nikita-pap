import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import { FormInputField } from "../../components/form/FormField";
import {
  deleteAdminTestDrive,
  fetchAdminTestDrives,
} from "../../services/adminApi";
import { formatAdminDateTime, handleAdminSessionError } from "../../utils/admin";

function AdminTestDrives() {
  const navigate = useNavigate();
  const [testDrives, setTestDrives] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTestDriveId, setDeletingTestDriveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTestDrives = testDrives.filter((testDrive) => {
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
      testDrive.hora_preferida,
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
          <div className="admin-filters admin-filters--single">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Viatura, nome, email, telefone, data ou hora"
            />
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
                const metaItems = [
                  ["Viatura", testDrive.vehicle_label || "-"],
                  ["Slug", testDrive.vehicle_slug ?? "-"],
                  ["Data", testDrive.data_preferida ?? "-"],
                  ["Hora", testDrive.hora_preferida ?? "-"],
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

                      <p className="admin-lead-card__timestamp">
                        {formatAdminDateTime(testDrive.created_at)}
                      </p>
                    </div>

                    <dl className="admin-lead-card__meta">
                      {metaItems.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="admin-lead-card__actions">
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
