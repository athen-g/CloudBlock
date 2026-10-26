import Section from '../components/Section'
import Figure03 from '../blueprints/Figure03'
import Figure05 from '../blueprints/Figure05'

export default function Encryption() {
  return (
    <Section id="encryption" number="04" title="Encryption">
      <p>
        CloudBlock uses authenticated encryption to protect each block independently. The encryption key is derived from the user&apos;s password using PBKDF2-HMAC-SHA256 with 600,000 iterations and a fresh 16-byte random salt, producing a 256-bit (32-byte) cryptographic key.
      </p>
      <p>
        The app requires passwords of at least 12 characters.
      </p>

      <Figure03 />

      <p>
        Each block is encrypted independently using AES-256-GCM (Galois/Counter Mode). For each block encryption operation, a fresh, cryptographically secure 12-byte random nonce is generated.
      </p>
      <p>
        CloudBlock supplies Associated Authenticated Data (AAD) to each AES-GCM operation. It combines the manifest JSON bytes, an ASCII colon (<code>:</code>), and the zero-based block index (for example, <code>header + b&apos;:&apos; + str(i).encode()</code>). This binds each encrypted block to its index and archive metadata; recovery also checks that the archive contains the expected block entries.
      </p>
      <p>
        The encrypted block byte layout is:
      </p>
      <p>
        <code>[12-byte nonce][ciphertext (0 to 65,536 bytes)][16-byte authentication tag]</code>
      </p>
      <p>
        This results in a fixed per-block overhead of exactly 28 bytes (12 bytes for the nonce + 16 bytes for the authentication tag).
      </p>

      <Figure05 />
    </Section>
  )
}
