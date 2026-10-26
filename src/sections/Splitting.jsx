import Section from '../components/Section'
import Figure01 from '../blueprints/Figure01'
import Figure02 from '../blueprints/Figure02'
import BlockCalculator from '../components/BlockCalculator'

export default function Splitting() {
  return (
    <Section id="splitting" number="03" title="Splitting into Blocks">
      <p>
        Files processed by CloudBlock are split into uniform 64 KiB (65,536 byte) blocks.
        The block size is defined as the constant <code>BLOCK = 65536</code> in <code>storage.py</code>.
      </p>

      <Figure01 />

      <p>
        The total number of blocks is computed using the formula:
      </p>
      <p>
        <code>max(1, ceil(size / 65536))</code> (implemented in Python as <code>max(1, (size + BLOCK - 1) // BLOCK)</code>).
      </p>
      <p>
        Even an empty file (0 bytes) produces exactly one block (containing 0 bytes of plaintext), ensuring that every valid archive contains at least one authenticated block. If the input file size is not an exact multiple of 64 KiB, the final block will be shorter than 65,536 bytes.
      </p>
      <p>
        CloudBlock enforces a maximum file size limit of 10 MiB (10,485,760 bytes), which produces at most 160 blocks.
      </p>

      <Figure02 />

      <h3>Block Calculator</h3>
      <BlockCalculator />
    </Section>
  )
}
