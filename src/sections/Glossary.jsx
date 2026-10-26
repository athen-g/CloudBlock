import Section from '../components/Section'

const TERMS = [
  {
    term: 'Block',
    def: 'A fixed-size chunk of file data. CloudBlock uses 64 KiB (65,536 bytes) blocks.',
  },
  {
    term: 'Nonce',
    def: 'A 12-byte random value used once per encryption operation. Each block gets a fresh nonce to ensure ciphertext uniqueness.',
  },
  {
    term: 'Salt',
    def: 'A 16-byte random value mixed into key derivation. Stored as 32 hex characters in the manifest. Ensures identical passwords produce different keys across archives.',
  },
  {
    term: 'Key Derivation',
    def: 'The process of converting a password into a cryptographic key. CloudBlock uses PBKDF2-HMAC-SHA256 with 600,000 iterations.',
  },
  {
    term: 'Authentication Tag',
    def: 'A 16-byte value produced by AES-256-GCM that verifies both the ciphertext and associated data have not been tampered with.',
  },
  {
    term: 'Associated Data',
    def: 'Additional plaintext (manifest bytes and block index) authenticated by AES-GCM but not encrypted. Prevents block reordering and metadata tampering.',
  },
  {
    term: 'Manifest',
    def: 'A JSON file inside the .cblock archive containing metadata: filename, file size, block count, salt, SHA-256 digest, and iteration count. These fields are not encrypted.',
  },
  {
    term: 'SHA-256 Digest',
    def: 'A 256-bit cryptographic hash of the original plaintext file, stored as 64 hex characters. Used to verify file integrity after decryption.',
  },
  {
    term: 'Archive',
    def: 'A ZIP-format file with .cblock extension containing the manifest and all encrypted blocks.',
  },
  {
    term: 'Origin Access Control (OAC)',
    def: 'An AWS mechanism that restricts S3 bucket access to a specific CloudFront distribution, keeping the bucket private.',
  },
  {
    term: 'CDN (Content Delivery Network)',
    def: "A distributed network of servers that delivers web content. CloudFront is AWS's CDN service, used here to serve this documentation page over HTTPS.",
  },
  {
    term: 'Static Site',
    def: 'A website consisting of pre-built files served as-is, with no server-side processing. This documentation page is a static site.',
  },
]

export default function Glossary() {
  return (
    <Section id="glossary" number="08" title="Glossary">
      <dl className="glossary-list">
        {TERMS.map((t) => (
          <div className="glossary-item" key={t.term}>
            <dt className="glossary-term">{t.term}</dt>
            <dd className="glossary-def">{t.def}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
