export interface BuildInfo {
  sha: string | undefined
  buildTime: string | undefined
}

export function getBuildInfo(): BuildInfo {
  const sha = import.meta.env.STORYBOOK_PREVIEW ? undefined : __BUILD_SHA__
  const buildTime = import.meta.env.STORYBOOK_PREVIEW ? undefined : __BUILD_TIME__

  return {
    sha,
    buildTime,
  }
}
