import Blueprint from '../components/Blueprint'

export default function Figure06() {
  const legend = [
    { color: '#4CAF50', label: 'Success path' },
    { color: '#E61919', label: 'Failure — abort' },
  ]

  const steps = [
    { num: '01', text: 'Validate archive size, entry count, and zip bomb checks' },
    { num: '02', text: 'Parse and validate manifest schema' },
    { num: '03', text: 'Verify block entry set matches expected names' },
    { num: '04', text: 'Authenticate and decrypt each block (AES-GCM tag check)' },
    { num: '05', text: 'Reassemble plaintext from decrypted blocks' },
    { num: '06', text: 'Verify total size matches manifest' },
    { num: '07', text: 'Verify SHA-256 digest matches manifest' },
    { num: '✓', text: 'Write output file (exclusive create — refuses overwrite)', type: 'pass' },
    { num: '✕', text: 'Any check fails → abort with error', type: 'fail' },
  ]

  return (
    <Blueprint
      id="fig-06"
      number="FIG. 06"
      title="Recovery and Verification"
      caption="decrypt.py performs multiple validation and integrity checks before writing any output. If any step fails — wrong password, tampered blocks, mismatched digest — recovery aborts without writing a file."
      legend={legend}
    >
      <div className="dia-step-list">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`dia-step${s.type ? ` ${s.type}` : ''}`}
          >
            <div className="dia-step-num">{s.num}</div>
            <div className="dia-step-text">{s.text}</div>
          </div>
        ))}
      </div>
    </Blueprint>
  )
}
