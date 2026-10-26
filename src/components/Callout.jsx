export default function Callout({ type = 'info', label, children }) {
  return (
    <div className={`callout${type === 'warning' ? ' warning' : ''}`}>
      <div className="callout-label">{label || (type === 'warning' ? 'Warning' : 'Note')}</div>
      {children}
    </div>
  )
}
