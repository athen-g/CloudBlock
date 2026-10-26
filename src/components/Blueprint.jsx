export default function Blueprint({ id, number, title, caption, legend, children }) {
  return (
    <figure className="blueprint" id={id} role="img" aria-label={`${number}: ${title}`}>
      <div className="blueprint-head">
        <span className="blueprint-num">{number}</span>
        <span className="blueprint-name">{title}</span>
      </div>
      <div className="blueprint-body">{children}</div>
      <div className="blueprint-foot">
        {legend && legend.length > 0 && (
          <div className="blueprint-legend">
            {legend.map((l, i) => (
              <span className="legend-item" key={i}>
                <span
                  className="legend-swatch"
                  style={{ background: l.color, ...(l.style || {}), ...(l.borderStyle ? { borderStyle: l.borderStyle } : {}) }}
                />
                {l.label}
              </span>
            ))}
          </div>
        )}
        <p className="blueprint-caption">{caption}</p>
      </div>
    </figure>
  )
}
