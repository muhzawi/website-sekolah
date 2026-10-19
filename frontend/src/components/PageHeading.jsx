function PageHeading({ breadcrumbs, title, description, size = 'default' }) {
  return (
    <header className={`page-heading page-heading--${size}`}>
      <div className="breadcrumbs" aria-label="Breadcrumb">
        {breadcrumbs.map((item, index) => (
          <span key={`${item}-${index}`}>
            {index > 0 && <span aria-hidden="true">/ </span>}
            {item}
          </span>
        ))}
      </div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  )
}

export default PageHeading
