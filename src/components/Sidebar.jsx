export default function Sidebar({ sections, active, isOpen, onNav }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar-nav" aria-label="Documentation navigation">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">CloudBlock</span>
        <span className="sidebar-brand-sub">Technical Documentation</span>
      </div>
      <nav>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`sidebar-link${active === s.id ? ' active' : ''}`}
            onClick={onNav}
            aria-current={active === s.id ? 'true' : undefined}
          >
            <span className="sidebar-link-num">{s.num}</span>
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}
