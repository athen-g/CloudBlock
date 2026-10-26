# AWS and GitHub deployment guide

This project publishes only portfolio/index.html through a CloudFront distribution backed by a private S3 bucket. The local Python application is not deployed.

## AWS resources

1. In the AWS console, create a CloudFormation stack named cloudblock-docs from template.json.
2. Wait for CREATE_COMPLETE and record BucketName, DistributionId, and WebsiteURL from the first stack outputs.
3. Create a second CloudFormation stack named cloudblock-github-deploy from github-deploy-role.json. Supply SiteBucketName and DistributionId from the first stack.

The second stack creates an IAM OIDC identity provider for GitHub Actions and a role. Its trust policy is restricted to the immutable repository and owner IDs for athen-g/CloudBlock, on main. The role can upload only the root index.html object and create invalidations only for the specified distribution. It does not grant access to read or list the bucket.

## GitHub Actions settings

In athen-g/CloudBlock, open Settings > Secrets and variables > Actions and configure:

- Repository secret AWS_DEPLOY_ROLE_ARN: the RoleArn output from cloudblock-github-deploy.
- Repository variable AWS_REGION: the region containing the S3 bucket (for this project, eu-north-1).
- Repository variable SITE_BUCKET: the BucketName output.
- Repository variable CLOUDFRONT_DISTRIBUTION_ID: the DistributionId output.

The workflow initially supports manual runs from the main branch, allowing the AWS connection to be checked before automatic deployment is enabled. From Actions > Deploy portfolio to AWS, run the workflow on main. A successful run uploads only the static portfolio page and invalidates / and /index.html.

After the first successful run, enable automatic deployment by adding a push trigger restricted to main and portfolio/** in .github/workflows/deploy-portfolio.yml. Future changes to the portfolio page then deploy from GitHub.

## Verify the deployment

- Open WebsiteURL and confirm the page loads over HTTPS.
- Confirm http:// redirects to HTTPS.
- Open the S3 object URL anonymously and confirm it returns AccessDenied.
- In CloudFront, wait for the distribution status to show Deployed.

Do not claim measured performance gains unless you record actual measurements. Charges depend on usage; check the AWS Billing and Cost Management console and monitor credits and usage.

## Cleanup

Disable the distribution and wait for its update to deploy. Delete the CloudFormation stacks when finished. The first stack retains its bucket to prevent accidental data loss; remove only this project's page object and then empty/delete that named bucket. Check for retained resources and billing activity.

## Official references

- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html
- https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws
