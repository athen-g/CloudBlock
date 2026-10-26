export default function Section({ id, number, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section-header">
        <span className="section-num">Section {number}</span>
        <h2 className="section-title" id={`${id}-title`}>{title}</h2>
      </div>
      {children}
    </section>
  )
}
