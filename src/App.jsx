import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Overview from './sections/Overview'
import CloudStorage from './sections/CloudStorage'
import Splitting from './sections/Splitting'
import Encryption from './sections/Encryption'
import Archive from './sections/Archive'
import Recovery from './sections/Recovery'
import Boundary from './sections/Boundary'
import Glossary from './sections/Glossary'
import Footer from './sections/Footer'

const SECTIONS = [
  { id: 'overview', num: '01', title: 'Overview' },
  { id: 'cloud-storage', num: '02', title: 'Cloud File Handling' },
  { id: 'splitting', num: '03', title: 'Block Splitting' },
  { id: 'encryption', num: '04', title: 'Encryption' },
  { id: 'archive', num: '05', title: 'Encrypted Download' },
  { id: 'recovery', num: '06', title: 'Recovery & Integrity' },
  { id: 'boundary', num: '07', title: 'Local vs Cloud' },
  { id: 'glossary', num: '08', title: 'Glossary' },
  { id: 'project', num: '09', title: 'Project Info' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <div className="site-layout">
      <header className="mobile-header">
        <span className="mobile-brand">CloudBlock</span>
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="sidebar-nav"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </header>

      {menuOpen && (
        <div
          className="mobile-overlay open"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <Sidebar
        sections={SECTIONS}
        active={active}
        isOpen={menuOpen}
        onNav={close}
      />

      <main className="main-content" role="main">
        <Overview />
        <CloudStorage />
        <Splitting />
        <Encryption />
        <Archive />
        <Recovery />
        <Boundary />
        <Glossary />
        <Footer />
      </main>
    </div>
  )
}
