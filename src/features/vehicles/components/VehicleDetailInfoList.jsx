function VehicleDetailInfoList({ rows, renderIcon }) {
  return (
    <div className="vehicle-detail__info-list">
      {rows.map((item) => (
        <div className="vehicle-detail__info-row" key={item.label}>
          <div className="vehicle-detail__info-icon">{renderIcon(item.type)}</div>
          <span className="vehicle-detail__info-label">{item.label}</span>
          <strong className="vehicle-detail__info-value">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default VehicleDetailInfoList;
