import Blueprint from '../components/Blueprint'

export default function Figure07() {
  const legend = [
    { color: '#1E1E1E', label: 'Local component' },
    { color: '#2A2A2A', label: 'AWS component' },
    { color: '#E61919', label: 'Security boundary' },
  ]

  const leftItems = [
    'Browser → localhost:8765',
    'Python HTTP Server',
    'static/ (UI files)',
    'data/*.cblock (encrypted archives)',
    'Files stay here',
  ]

  const rightItems = [
    'Visitor (HTTPS)',
    'CloudFront CDN',
    'Origin Access Control',
    'Private S3 Bucket',
    'index.html (this page)',
    'Documentation only',
  ]

  return (
    <Blueprint
      id="fig-07"
      number="FIG. 07"
      title="Local App vs AWS Boundary"
      caption="The local encryption app and the AWS-hosted documentation page are completely separate. Encrypted .cblock archives are stored only on the user's machine and are never uploaded to AWS."
      legend={legend}
    >
      <div>
        <div className="dia-boundary">
          <div className="dia-boundary-col">
            <div className="dia-boundary-label">YOUR COMPUTER</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              {leftItems.map((item, idx) => (
                <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                  <div className="dia-box" style={{ width: '100%' }}>{item}</div>
                  {idx < leftItems.length - 1 && <div className="dia-arrow">↓</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="dia-boundary-div" />

          <div className="dia-boundary-col">
            <div className="dia-boundary-label">AWS (eu-north-1)</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
              {rightItems.map((item, idx) => (
                <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                  <div className="dia-box" style={{ width: '100%', background: '#2A2A2A' }}>{item}</div>
                  {idx < rightItems.length - 1 && <div className="dia-arrow">↓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--error)',
            textAlign: 'center',
            marginTop: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Encrypted files never cross this boundary
        </div>
      </div>
    </Blueprint>
  )
}
