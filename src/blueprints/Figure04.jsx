import Blueprint from '../components/Blueprint'

export default function Figure04() {
  const legend = [
    { color: '#4CAF50', label: 'Unencrypted metadata' },
    { color: '#E61919', label: 'Encrypted content' },
  ]

  return (
    <Blueprint
      id="fig-04"
      number="FIG. 04"
      title=".cblock Archive Contents"
      caption="The .cblock archive is a standard ZIP file (uncompressed). The manifest contains plaintext metadata for validation. Block files contain the actual encrypted data."
      legend={legend}
    >
      <pre className="dia-tree" style={{ margin: 0 }}>
        <span className="tree-name">archive.cblock</span> (ZIP_STORED){'\n'}
        ├── <span className="tree-name">manifest.json</span>          <span className="tree-note" style={{ color: '#4CAF50' }}>[UNENCRYPTED]</span>{'\n'}
        │   ├── block_size: <span className="tree-accent">65536</span>{'\n'}
        │   ├── count: <span className="tree-accent">{'<block count>'}</span>{'\n'}
        │   ├── iterations: <span className="tree-accent">600000</span>{'\n'}
        │   ├── name: <span className="tree-accent">{'<original filename>'}</span>{'\n'}
        │   ├── salt: <span className="tree-accent">{'<32 hex chars>'}</span>{'\n'}
        │   ├── sha256: <span className="tree-accent">{'<64 hex chars>'}</span>{'\n'}
        │   ├── size: <span className="tree-accent">{'<file size in bytes>'}</span>{'\n'}
        │   └── version: <span className="tree-accent">1</span>{'\n'}
        ├── <span className="tree-name">blocks/</span>{'\n'}
        │   ├── <span className="tree-name">000000.enc</span>         <span className="tree-note" style={{ color: '#E61919' }}>[ENCRYPTED]</span>{'\n'}
        │   ├── <span className="tree-name">000001.enc</span>         <span className="tree-note" style={{ color: '#E61919' }}>[ENCRYPTED]</span>{'\n'}
        │   ├── <span className="tree-name">...</span>                <span className="tree-note" style={{ color: '#E61919' }}>[ENCRYPTED]</span>{'\n'}
        │   └── <span className="tree-name">00000N.enc</span>         <span className="tree-note" style={{ color: '#E61919' }}>[ENCRYPTED]</span>
      </pre>
    </Blueprint>
  )
}
