# Verification record

Checked 23 October 2026.

- Eight unittest methods passed, including seven round-trip boundary sizes up to 10 MiB.
- Incorrect passwords, modified ciphertext, altered metadata and missing blocks were rejected.
- HTTP test: 200,000 input bytes, four blocks, 200,894 archive bytes, recovery identical to the input.
- Input and recovered SHA-256: `d409a5e47fac4c6476141969a09a57e97eb730da1ee5ff7f3f0f6133bbaf1070`.
- Five application endpoints returned 200; invalid download and data-directory requests returned 404; short password returned 400; foreign origin upload returned 403.
- Final personalized portfolio served successfully and contained the verified name, projects and profile links.
- JavaScript syntax check passed. CloudFormation template parses as JSON; AWS account-side validation has not been run.
- Report exported by Microsoft Word and inspected as rendered page images.

Limitations: in-app browser visual testing was blocked. No screenshot or browser interaction pass is claimed. No AWS infrastructure was deployed, and HTTPS/CDN behavior was not observed. Run the supplied project locally and follow the AWS deployment guide for that remaining cloud demonstration.
