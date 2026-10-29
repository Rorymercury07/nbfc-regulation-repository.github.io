const [repositoryOwner = '', repositoryName = ''] =
  process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const isGitHubUserSite =
  repositoryName.toLowerCase() ===
  `${repositoryOwner.toLowerCase()}.github.io`;
const isGitHubProjectSite =
  process.env.GITHUB_ACTIONS === 'true' &&
  !isGitHubUserSite;
const assetPrefix = isGitHubProjectSite ? `/${repositoryName}` : '';

const nextConfig = {
  output: 'export' as const,
  trailingSlash: true,
  assetPrefix: assetPrefix || undefined,
};

export default nextConfig;
