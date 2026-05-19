function AdminVehicleNoveltyToggle({ checked, onChange }) {
  return (
    <div className="admin-form__notice">
      <label className="admin-form__checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange("novidade", event.target.checked)}
        />
        Marcar como novidade
      </label>

      <p className="admin-form__hint">
        Ativa esta opção se quiseres mostrar a badge "Novo" na viatura.
      </p>

    </div>
  );
}

export default AdminVehicleNoveltyToggle;
