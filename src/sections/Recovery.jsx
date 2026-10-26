import Section from '../components/Section'
import Callout from '../components/Callout'
import Figure06 from '../blueprints/Figure06'

export default function Recovery() {
  return (
    <Section id="recovery" number="06" title="Recovery and Integrity Checks">
      <p>
        <code>decrypt.py</code> is a standalone command-line recovery tool designed for fully offline operation without requiring the web server. It accepts two positional arguments: the path to the <code>.cblock</code> archive and the desired output file path.
      </p>
      <p>
        The recovery process performs strict multi-stage integrity and authentication checks:
      </p>
      <ol>
        <li>
          <strong>Validate archive dimensions and schema:</strong> Checks that the archive does not exceed the size ceiling (10 MiB + 100 KB slack), limits entry count to a maximum of 162 entries to prevent archive-based zip bomb attacks, and verifies that no individual entry exceeds 10 MiB. It parses <code>manifest.json</code> and verifies that <code>version === 1</code>, <code>iterations === 600000</code>, <code>block_size === 65536</code>, <code>0 &lt;= size &lt;= 10 MiB</code>, and <code>count === max(1, (size + BLOCK - 1) // BLOCK)</code>.
        </li>
        <li>
          <strong>Validate block set:</strong> Verifies that the exact set of archive entry names strictly matches the expected set (<code>manifest.json</code> plus exactly <code>blocks/000000.enc</code> through <code>blocks/&lt;count-1&gt;.enc</code>), rejecting any missing, duplicate, or unexpected files.
        </li>
        <li>
          <strong>Authenticate and decrypt each block:</strong> Uses AES-256-GCM with the derived key. The Associated Authenticated Data (AAD) consisting of <code>canonical manifest bytes + &apos;:&apos; + block index</code> is provided to the cipher. Any tampering with block ciphertext, nonce, tag, block order, or manifest metadata triggers an immediate <code>InvalidTag</code> exception.
        </li>
        <li>
          <strong>Reassemble and verify digest:</strong> Concatenates all decrypted blocks into plaintext. Verifies that the total byte length matches the manifest <code>size</code> field and that the cryptographic SHA-256 digest matches the manifest <code>sha256</code> field.
        </li>
        <li>
          <strong>Safe write:</strong> Output is written to disk only AFTER all authenticity and integrity checks have passed. Files are written using Python&apos;s exclusive creation mode (<code>&apos;xb&apos;</code>), refusing to overwrite any existing files to protect user data.
        </li>
      </ol>
      <p>
        If any validation, authentication, or integrity check fails, the recovery process aborts immediately with an error message and leaves no partial output on disk.
      </p>

      <Callout type="warning">
        <p>
          There is no password recovery mechanism. If the password is forgotten, the encrypted data cannot be decrypted.
        </p>
      </Callout>

      <Figure06 />
    </Section>
  )
}
