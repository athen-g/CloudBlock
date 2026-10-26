# CloudBlock

Cloud computing mini project: split a file into independently authenticated encrypted blocks, package the blocks, and recover the original file offline.

The project also includes a static portfolio page prepared for S3 and CloudFront. GitHub Actions uses short-lived AWS credentials through OpenID Connect; it does not store AWS access keys.

## Run locally

Requires Python 3.10 or later.

    python -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    .\.venv\Scripts\python.exe app.py

Open http://127.0.0.1:8765. Choose a file (maximum 10 MiB), enter a password of at least 12 characters, and select **Split and encrypt**. Download the .cblock archive and keep the password.

Recover the archive offline:

    .\.venv\Scripts\python.exe decrypt.py "download.cblock" "recovered.bin"

The tool authenticates each block, verifies the reconstructed SHA-256 digest, and writes output only after successful verification. It refuses to overwrite an existing file.

## Design

Files are split into 64 KiB blocks. AES-256-GCM encrypts each block with a random nonce. A 16-byte random salt and PBKDF2-HMAC-SHA256 with 600,000 iterations derive the key. The manifest bytes and block index are authenticated as associated data. The manifest includes the visible filename, file size, block count, salt, and plaintext digest; metadata privacy is outside this prototype.

## AWS portfolio deployment

The static page in portfolio/ is separate from the local Python app. AWS hosts only this page, not the encryption service or user files.

- aws/template.json creates a private S3 bucket, a CloudFront distribution, an Origin Access Control, and a bucket policy limited to that distribution.
- aws/github-deploy-role.json defines the GitHub Actions OIDC provider and a role scoped to this repository's main branch.
- .github/workflows/deploy-portfolio.yml uploads only portfolio/index.html and invalidates the two page paths.
- aws/DEPLOYMENT.md contains the AWS and GitHub configuration steps.

The workflow uses a short-lived OIDC role, no saved AWS keys. Before enabling it, configure the AWS role, the Actions secret and variables documented in the deployment guide. Check AWS billing and credits and continue monitoring usage.

## Safety and scope

This is a single-user educational prototype, not HDFS or a distributed cloud storage service. The local controller binds only to loopback. Passwords and plaintext pass through local HTTP and server memory. Archives persist under data/; there is no login, password reset, storage quota, replication, streaming, or deletion UI. Forgotten passwords cannot be recovered. Do not expose the local service to a LAN or the internet.

Keep .venv/, __pycache__/, and data/ out of version control. Do not upload the project root or user archives to the website bucket.
