import Blueprint from '../components/Blueprint'

export default function Figure02() {
  const legend = [
    { color: '#1E1E1E', label: 'Full block (64 KiB)' },
    {
      color: 'transparent',
      label: 'Short final block (dashed)',
      style: { background: 'transparent', borderStyle: 'dashed' },
      borderStyle: 'dashed',
    },
  ]

  return (
    <Blueprint
      id="fig-02"
      number="FIG. 02"
      title="Block Layout"
      caption="Files are divided into sequential 64 KiB blocks. The last block may contain fewer bytes. An empty file still produces one (empty) block."
      legend={legend}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="dia-blocks-row">
          <div className="dia-block-unit">00</div>
          <div className="dia-block-unit">01</div>
          <div className="dia-block-unit">02</div>
          <div className="dia-block-unit">03</div>
          <div className="dia-block-unit short">04</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          Block 00–03: 65,536 bytes each · Block 04: remaining bytes (may be shorter)
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          count = max(1, ⌈size ÷ 65,536⌉)
        </div>
      </div>
    </Blueprint>
  )
}
