import Section from '../components/Section'
import Callout from '../components/Callout'
import Figure07 from '../blueprints/Figure07'

export default function Boundary() {
  return (
    <Section id="boundary" number="08" title="Local App vs Cloud-Hosted Page">
      <p>
        CloudBlock maintains a strict architectural separation between two completely independent environments:
      </p>
      <ol>
        <li>
          <strong>The LOCAL encryption application:</strong> A local Python HTTP server running at <code>127.0.0.1:8765</code> serving the file upload and download interface from the local <code>static/</code> directory. All encrypted <code>.cblock</code> archives are saved locally inside <code>data/</code> on the user&apos;s machine. The application executes purely on the local machine without remote network dependencies.
        </li>
        <li>
          <strong>The DOCUMENTATION page (this site):</strong> A purely static HTML website hosted on AWS. It is delivered globally via CloudFront over HTTPS from a private Amazon S3 bucket protected with Origin Access Control (OAC). It uses no cloud database, no backend server or API, and no custom domain. The AWS infrastructure is hosted in the <code>eu-north-1</code> region.
        </li>
      </ol>
      <p>
        Encrypted files NEVER cross to AWS. The documentation site stores no user data and has no backend to receive any. Its in-browser tool (Section 07) runs entirely inside your browser tab using the Web Crypto API, so the file and password are never sent to AWS, and the page cannot communicate with or access the local encryption application.
      </p>
      <p>
        The automated GitHub Actions deployment workflow publishes only this static documentation page (<code>index.html</code>) using short-lived AWS IAM OIDC federation tokens. The least-privilege IAM deployment role permits strictly two actions: uploading the root <code>index.html</code> object to the S3 bucket and creating a CloudFront cache invalidation.
      </p>

      <Callout type="info">
        <p>
          Encrypted files never leave the user&apos;s computer. AWS hosts only this documentation page.
        </p>
      </Callout>

      <Figure07 />
    </Section>
  )
}
