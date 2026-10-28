import Section from '../components/Section'
import Callout from '../components/Callout'
import BrowserTool from '../components/BrowserTool'

export default function BrowserTry() {
  return (
    <Section id="browser-tool" number="07" title="Try It in Your Browser">
      <p>
        The splitting and encryption described above also runs here, directly in this page. It is a
        JavaScript port of <code>storage.py</code> built on the browser&apos;s Web Crypto API: the same
        64 KiB blocks, AES-256-GCM per block with a random nonce, a PBKDF2-HMAC-SHA256 key with
        600,000 iterations, and the same authenticated manifest.
      </p>
      <p>
        The archive format is identical, so a file encrypted on this page can be recovered offline
        with <code>decrypt.py</code>, and an archive made by the local app can be recovered here.
        Recovery follows the same order of checks: archive structure, block set, per-block
        authentication, then the SHA-256 digest. Nothing is offered for download until all of them pass.
      </p>

      <BrowserTool />

      <Callout type="info" label="Where your file goes">
        <p>
          The file and password stay in this browser tab. The page has no backend, so there is nothing
          for them to be sent to. To check, open your browser&apos;s network panel while you run it, or
          disconnect from the network after the page has loaded.
        </p>
      </Callout>

      <Callout type="warning">
        <p>
          This is an educational prototype and has not been independently audited. There is no password
          recovery: a forgotten password means the data is gone. The manifest still shows the file name
          and size. Prefer the local app and <code>decrypt.py</code> for anything sensitive.
        </p>
      </Callout>
    </Section>
  )
}
