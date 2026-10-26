export function Spinner({ label = 'Memuat...', size = 'default' }) {
  return (
    <span className="feedback-spinner" role="status" aria-label={label}>
      <span className={`spinner spinner--${size}`} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </span>
  )
}

export function Skeleton({ className = '', width, height, radius }) {
  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(radius ? { borderRadius: radius } : {}),
  }

  return <span className={`skeleton ${className}`.trim()} style={style} aria-hidden="true" />
}

export function DashboardSkeleton() {
  return (
    <div className="feedback-dashboard-skeleton" role="status" aria-label="Memuat dashboard">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="surface feedback-stat-skeleton" key={index}>
          <Skeleton width="32px" height="32px" radius="10px" />
          <Skeleton width="56%" height="30px" />
          <Skeleton width="72%" height="14px" />
        </div>
      ))}
      <span className="visually-hidden">Memuat dashboard...</span>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`

  return (
    <div className="feedback-table-skeleton" role="status" aria-label="Memuat data">
      <div className="feedback-table-skeleton-row" style={{ gridTemplateColumns }}>
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} height="14px" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div className="feedback-table-skeleton-row" style={{ gridTemplateColumns }} key={rowIndex}>
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton key={columnIndex} height="16px" />
          ))}
        </div>
      ))}
      <span className="visually-hidden">Memuat data...</span>
    </div>
  )
}

export function NewsGridSkeleton({ count = 3 }) {
  return (
    <div className="news-grid feedback-news-grid-skeleton" role="status" aria-label="Memuat berita">
      {Array.from({ length: count }, (_, index) => (
        <div className="surface feedback-news-card-skeleton" key={index}>
          <Skeleton height="170px" radius="14px" />
          <Skeleton width="38%" height="12px" />
          <Skeleton width="86%" height="20px" />
          <Skeleton width="100%" height="14px" />
          <Skeleton width="72%" height="14px" />
        </div>
      ))}
      <span className="visually-hidden">Memuat berita...</span>
    </div>
  )
}

export function EmptyState({ title = 'Belum ada data', description, action }) {
  return (
    <div className="empty-state feedback-empty-state">
      <span className="feedback-empty-icon" aria-hidden="true">○</span>
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  )
}

export function ErrorState({ message = 'Terjadi kesalahan saat memuat data.', onRetry }) {
  return (
    <div className="error-state" role="alert">
      <strong>Data gagal dimuat</strong>
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  )
}
