import Blueprint from '../components/Blueprint'

export default function Figure05() {
  const legend = [
    { color: '#1E1E1E', label: 'Input / Output' },
    { color: '#FF6B00', label: 'KDF function' },
  ]

  return (
    <Blueprint
      id="fig-05"
      number="FIG. 05"
      title="Key Derivation"
      caption="The user's password and a 16-byte random salt are fed into PBKDF2-HMAC-SHA256 with 600,000 iterations, producing a 256-bit key for AES-256-GCM encryption. A new random salt is generated for each archive."
      legend={legend}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <div className="dia-flow">
          <div className="dia-box">PASSWORD (≥12 chars)</div>
          <div className="dia-arrow">+</div>
          <div className="dia-box">SALT (16 bytes)</div>
        </div>
        <div className="dia-flow">
          <div className="dia-arrow">→</div>
          <div className="dia-box highlight">PBKDF2-HMAC-SHA256 (600,000 iter.)</div>
          <div className="dia-arrow">→</div>
          <div className="dia-box">256-BIT KEY (32 bytes)</div>
        </div>
      </div>
    </Blueprint>
  )
}
