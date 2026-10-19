const iconPaths = {
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 9h6v6H9zM9 1v4m6-4v4m-6 14v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.5H18a4 4 0 0 0 4-4c0-4.5-4.5-8.2-10-8.2Z" />
      <path d="M7.5 11h.01M10 7.5h.01M15 7.5h.01M17 11h.01" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M8 6h8v4H8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3m-13 5h18m-11 0v2h4v-2" />
    </>
  ),
}

function ProgramIcon({ name }) {
  return (
    <svg
      className="program-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name] ?? iconPaths.briefcase}
    </svg>
  )
}

export default ProgramIcon
