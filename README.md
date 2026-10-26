# CloudBlock

Cloud computing mini project: split a file into independently authenticated encrypted blocks, package them, and recover the original file offline.

The repository also includes a static portfolio page hosted by Amazon S3 and CloudFront. AWS hosts only that page; it does not host the local encryption service or user files.

**Live portfolio:** https://d3kx026zzkouwc.cloudfront.net

## Run locally

Requires Python 3.10 or later.

    python -m venv .venv
    .venv\Scripts\python.exe -m pip install -r requirements.txt
    .venv\Scripts\python.exe app.py

Open http://127.0.0.1:8765. Choose a file (maximum 10 MiB), enter a password of at least 12 characters, and select **Split and encrypt**. Download the .cblock archive and keep the password.

Recover the archive offline:

    .venv\Scripts\python.exe decrypt.py "download.cblock" "recovered.bin"

The tool authenticates every block, verifies the reconstructed SHA-256 digest, and writes output only after successful verification. It refuses to overwrite an existing file.

## Encryption design

Files are split into 64 KiB blocks. AES-256-GCM encrypts each block with a random nonce. A 16-byte random salt and PBKDF2-HMAC-SHA256 with 600,000 iterations derive the key. The manifest bytes and block index are authenticated as associated data. The manifest includes the visible filename, file size, block count, salt, and plaintext digest; metadata privacy is outside this prototype.

## AWS portfolio deployment

The portfolio page in portfolio/ is separate from the local Python app. The AWS stack is deployed in eu-north-1 with a private S3 bucket, CloudFront Origin Access Control and a CloudFront distribution. Direct anonymous requests to the S3 object are denied.

- aws/template.json defines the S3 bucket, CloudFront distribution, Origin Access Control and bucket policy.
- aws/github-deploy-role.json defines the GitHub Actions OIDC provider and role. Its trust is restricted to this repository's main branch; permissions cover only uploading portfolio/index.html and invalidating this distribution.
- .github/workflows/deploy-portfolio.yml supports manual runs and deploys when portfolio/index.html changes on main.
- aws/DEPLOYMENT.md documents the AWS and GitHub configuration.

GitHub Actions uses short-lived OIDC credentials; no AWS access keys are stored in the repository. The initial manual deployment succeeded. Monitor AWS billing and credits because S3 and CloudFront usage can incur charges.

## Safety and scope

This is a single-user educational prototype, not HDFS or a distributed cloud storage service. The local controller binds only to loopback. Passwords and plaintext pass through local HTTP and server memory. Archives persist under data/; there is no login, password reset, storage quota, replication, streaming, or deletion UI. Forgotten passwords cannot be recovered. Do not expose the local service to a LAN or the internet.

Keep .venv/, __pycache__/, and data/ out of version control. Do not upload the project root or user archives to the website bucket.
