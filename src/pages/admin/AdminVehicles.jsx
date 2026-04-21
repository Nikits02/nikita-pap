import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_NEW_VEHICLE_PATH,
} from "../../data/adminNavigation";
import { deleteAdminVehicle, fetchAdminVehicles } from "../../services/adminApi";
import { formatEuro } from "../../utils/format";
import { formatAdminDate, handleAdminSessionError } from "../../utils/admin";

const SOURCE_LABELS = {
  stock: "Catalogo",
  catalog: "Catalogo",
  highlight: "Destaques da Semana",
};

function getVehicleName(vehicle) {
  return [vehicle.marca, vehicle.modelo].filter(Boolean).join(" ").trim();
}

function AdminVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingVehicleId, setDeletingVehicleId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      try {
        setIsLoading(true);
        const loadedVehicles = await fetchAdminVehicles();

        if (isMounted) {
          setVehicles(loadedVehicles);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(loadError.message ?? "Nao foi possivel carregar as viaturas.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleDeleteVehicle(vehicle) {
    const vehicleName = getVehicleName(vehicle) || `viatura #${vehicle.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${vehicleName}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingVehicleId(vehicle.id);
      await deleteAdminVehicle(vehicle.id);
      setVehicles((currentVehicles) =>
        currentVehicles.filter(({ id }) => id !== vehicle.id),
      );
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(deleteError.message ?? "Nao foi possivel eliminar a viatura.");
    } finally {
      setDeletingVehicleId(null);
    }
  }

  return (
    <AdminPageShell
      title="Painel de Viaturas"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks
          current="vehicles"
          extraActions={
            <Link className="admin-button" to={ADMIN_NEW_VEHICLE_PATH}>
              Nova Viatura
            </Link>
          }
        />
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar viaturas...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : vehicles.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda nao existem viaturas registadas no painel.
          </p>

          <Link className="admin-button" to={ADMIN_NEW_VEHICLE_PATH}>
            Criar primeira viatura
          </Link>
        </div>
      ) : (
        <div className="admin-vehicles">
          <p className="admin-page__text admin-page__text--muted">
            {vehicles.length} viatura{vehicles.length === 1 ? "" : "s"} carregada
            {vehicles.length === 1 ? "" : "s"}.
          </p>

          <div className="admin-vehicles__list">
            {vehicles.map((vehicle) => {
              const vehicleName = getVehicleName(vehicle);

              return (
                <article className="admin-vehicle-card" key={vehicle.id}>
                  <div className="admin-vehicle-card__media">
                    {vehicle.imagem ? (
                      <img
                        className="admin-vehicle-card__image"
                        src={vehicle.imagem}
                        alt={vehicleName || `Viatura ${vehicle.id}`}
                      />
                    ) : (
                      <div className="admin-vehicle-card__placeholder">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="admin-vehicle-card__content">
                    <div className="admin-vehicle-card__heading">
                      <p className="admin-vehicle-card__eyebrow">
                        {vehicle.marca || "Marca"}
                      </p>
                      <h2 className="admin-vehicle-card__title">
                        {vehicle.modelo || `Viatura #${vehicle.id}`}
                      </h2>
                    </div>

                    <dl className="admin-vehicle-card__meta">
                      <div>
                        <dt>Preco</dt>
                        <dd>{formatEuro(vehicle.preco)} EUR</dd>
                      </div>
                      <div>
                        <dt>Origem</dt>
                        <dd>{SOURCE_LABELS[vehicle.source] ?? vehicle.source ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Ano</dt>
                        <dd>{vehicle.ano ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Inserida</dt>
                        <dd>{formatAdminDate(vehicle.inserted_at)}</dd>
                      </div>
                    </dl>

                    <div className="admin-vehicle-card__actions">
                      <Link
                        className="admin-button admin-button--secondary"
                        to={`/admin/viaturas/${vehicle.id}/editar`}
                      >
                        Editar
                      </Link>

                      <button
                        className="admin-button admin-button--danger"
                        type="button"
                        disabled={deletingVehicleId === vehicle.id}
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        {deletingVehicleId === vehicle.id
                          ? "A eliminar..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminVehicles;
