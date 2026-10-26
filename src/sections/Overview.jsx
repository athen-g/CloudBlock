import Section from '../components/Section'
import Callout from '../components/Callout'

export default function Overview() {
  return (
    <Section id="overview" number="01" title="Overview">
      <p>
        CloudBlock is a Mini Project 2 educational tool demonstrating client-side file
        encryption using block splitting.
      </p>
      <p>
        Built with Python using the standard-library HTTP server, the browser-based UI
        at <code>localhost:8765</code> (or <code>127.0.0.1:8765</code>) lets users encrypt files into
        blocks and download them as a <code>.cblock</code> archive.
      </p>
      <p>
        Each file is split into 64 KiB blocks, encrypted with AES-256-GCM using a password-derived
        key, and packaged into a single archive for offline recovery.
      </p>
      <p>
        This is a single-user local prototype. It has no accounts, database, replication, or
        cloud file sync. Encrypted data never leaves the user&apos;s machine.
      </p>
      <p>
        This documentation site is hosted separately on AWS (CloudFront + S3) and contains
        no user data.
      </p>
      <Callout type="info">
        <p>
          CloudBlock is a local prototype for educational purposes. It does not store or transmit
          encrypted files to any cloud service.
        </p>
      </Callout>
    </Section>
  )
}
