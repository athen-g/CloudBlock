import Blueprint from '../components/Blueprint'

export default function Figure01() {
  const legend = [
    { color: '#1E1E1E', label: 'Processing stage' },
    { color: '#FF6B00', label: 'Encryption' },
  ]

  return (
    <Blueprint
      id="fig-01"
      number="FIG. 01"
      title="Encryption Pipeline"
      caption="A file enters the pipeline, is split into fixed-size blocks, encrypted individually with AES-256-GCM, packaged into a .cblock archive, and can later be decrypted offline with decrypt.py."
      legend={legend}
    >
      <div className="dia-flow">
        <div className="dia-box">FILE</div>
        <div className="dia-arrow">→</div>
        <div className="dia-box">64 KiB BLOCKS</div>
        <div className="dia-arrow">→</div>
        <div className="dia-box highlight">AES-256-GCM</div>
        <div className="dia-arrow">→</div>
        <div className="dia-box">.CBLOCK ARCHIVE</div>
        <div className="dia-arrow">→</div>
        <div className="dia-box">OFFLINE DECRYPT</div>
      </div>
    </Blueprint>
  )
}
