import Blueprint from '../components/Blueprint'

export default function Figure03() {
  const legend = [
    { color: 'rgba(255, 107, 0, 0.3)', label: 'Nonce (IV)' },
    { color: 'rgba(255, 107, 0, 0.1)', label: 'Ciphertext' },
    { color: 'rgba(230, 25, 25, 0.3)', label: 'Authentication tag' },
  ]

  return (
    <Blueprint
      id="fig-03"
      number="FIG. 03"
      title="Encrypted Block Structure"
      caption="Each encrypted block contains a 12-byte random nonce, the AES-256-GCM ciphertext (same length as the plaintext chunk), and a 16-byte authentication tag. The nonce is generated fresh for every block."
      legend={legend}
    >
      <div className="dia-bar">
        <div className="dia-bar-seg" style={{ flex: 1, background: 'rgba(255, 107, 0, 0.3)' }}>
          <span className="seg-label">Nonce</span>
          <span className="seg-size">12 bytes</span>
        </div>
        <div className="dia-bar-seg" style={{ flex: 3, background: 'rgba(255, 107, 0, 0.1)' }}>
          <span className="seg-label">Ciphertext</span>
          <span className="seg-size">0–65,536 bytes</span>
        </div>
        <div className="dia-bar-seg" style={{ flex: 1, background: 'rgba(230, 25, 25, 0.3)' }}>
          <span className="seg-label">Auth Tag</span>
          <span className="seg-size">16 bytes</span>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
        Bytes 0–11: Nonce · Bytes 12–(12+N-1): Ciphertext · Final 16 bytes: Tag · Total: N + 28 bytes
      </div>
    </Blueprint>
  )
}
