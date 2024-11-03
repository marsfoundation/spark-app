// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getBuildInfo() {
  const buildSha = import.meta.env.STORYBOOK_PREVIEW ? undefined : __BUILD_SHA__
  const buildTime = import.meta.env.STORYBOOK_PREVIEW ? undefined : __BUILD_TIME__

  return {
    buildSha,
    buildTime,
  }
}
