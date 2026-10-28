# CloudBlock

Cloud computing mini project: split a file into independently authenticated encrypted blocks, package the blocks, and recover the original file offline.

The repository also contains a technical documentation site about CloudBlock. The local Python encryption app and the AWS-hosted static site are separate: AWS does not host the encryption service or user files.

**CloudFront site:** https://d3kx026zzkouwc.cloudfront.net

The site also includes an in-browser version of the tool (Section 07, `src/crypto/cblock.js`). It is a Web Crypto port of `storage.py` that runs entirely in the visitor's browser tab: the file and password are never uploaded, and the archives use the same `.cblock` format, so they can be recovered with `decrypt.py` and vice versa. AWS still only serves the static page.

## Run the Python app locally

Requires Python 3.10 or later.

    python -m venv .venv
    .venv\Scripts\python.exe -m pip install -r requirements.txt
    .venv\Scripts\python.exe app.py

Open http://127.0.0.1:8765. Choose a file (maximum 10 MiB), enter a password of at least 12 characters, and select **Split and encrypt**. Download the `.cblock` archive and keep the password.

Recover the archive offline:

    .venv\Scripts\python.exe decrypt.py "download.cblock" "recovered.bin"

The tool authenticates each block, verifies the reconstructed SHA-256 digest, and writes output only after successful verification. It refuses to overwrite an existing file.

## Run the documentation site

Requires Node.js 20 or later.

    npm ci
    npm run dev

Vite serves the site locally. To make the self-contained production file, run:

    npm run build

The build creates `dist/index.html`, which can also be opened directly in a modern browser. `npm run preview` serves the production build locally.

## Encryption design

Files are split into 64 KiB blocks. AES-256-GCM encrypts each block with a random nonce. A 16-byte random salt and PBKDF2-HMAC-SHA256 with 600,000 iterations derive the key. The manifest bytes and block index are authenticated as associated data. The manifest includes the visible filename, file size, block count, salt, and plaintext digest; metadata privacy is outside this prototype.

## AWS documentation site deployment

The static documentation page is built from `src/` into one `dist/index.html`, then served through CloudFront from a private S3 bucket. The bucket blocks public access; CloudFront uses Origin Access Control. GitHub Actions builds and uploads only the root `index.html` object and invalidates `/` and `/index.html`.

- `aws/template.json` defines the S3 bucket, CloudFront distribution, Origin Access Control, and bucket policy.
- `aws/github-deploy-role.json` defines the GitHub Actions OIDC provider and the deployment role, restricted to this repository's `main` branch.
- `.github/workflows/deploy-portfolio.yml` supports manual runs and pushes affecting the site source or build configuration. It uses short-lived OIDC credentials; the repository does not store AWS access keys.
- `aws/DEPLOYMENT.md` documents the AWS and GitHub configuration.

The IAM role can upload only `index.html` to the configured bucket and create invalidations for the configured distribution. Check AWS billing and credits and monitor usage.

## Safety and scope

This is a single-user educational prototype, not HDFS or a distributed cloud storage service. The local controller binds only to loopback. Passwords and plaintext pass through local HTTP and server memory. Archives persist under `data/`; there is no login, password reset, storage quota, replication, streaming, or deletion UI. Forgotten passwords cannot be recovered. Do not expose the local service to a LAN or the internet.

The project verification record lists eight passing local test methods. Those tests do not validate AWS. A working CloudFront page does not mean the local encryption app is hosted in the cloud.

Keep `.venv/`, `__pycache__/`, `data/`, `node_modules/`, and `dist/` out of version control. Do not upload the project root or user archives to the website bucket.
