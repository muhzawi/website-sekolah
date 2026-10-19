import { useEffect, useState } from 'react'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ContactPage from './pages/ContactPage.jsx'
import { FaqPage, PpdbPage, RegistrationPage } from './pages/AdmissionsPages.jsx'
import HomePage from './pages/HomePage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import { ProfilePage, ProgramsPage } from './pages/SchoolInfoPages.jsx'
import './App.css'
import './pages/SchoolPages.css'

const knownPages = new Set([
  'home',
  'profile',
  'programs',
  'news',
  'contact',
  'ppdb',
  'registration',
  'faq',
])

function getPageFromLocation() {
  const requestedPage = new URLSearchParams(window.location.search).get('page')
  return knownPages.has(requestedPage) ? requestedPage : 'home'
}

function App() {
  const [page, setPage] = useState(getPageFromLocation)

  useEffect(() => {
    const syncPage = () => setPage(getPageFromLocation())
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])

  function navigate(event, nextPage) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    const url = new URL(window.location.href)
    url.searchParams.set('page', nextPage)
    window.history.pushState({}, '', url)
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const pageContent = {
    home: <HomePage onNavigate={navigate} />,
    profile: <ProfilePage />,
    programs: <ProgramsPage />,
    news: <NewsPage />,
    contact: <ContactPage />,
    ppdb: <PpdbPage onNavigate={navigate} />,
    registration: <RegistrationPage />,
    faq: <FaqPage onNavigate={navigate} />,
  }[page]

  return (
    <div className="site-shell">
      <Navbar activePage={page} onNavigate={navigate} />
      <main className="page-container">{pageContent}</main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
