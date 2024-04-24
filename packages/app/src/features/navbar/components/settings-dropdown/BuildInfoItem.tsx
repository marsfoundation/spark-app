import { SettingsDropdownItem } from './SettingsDropdownItem'

export function BuildInfoItem() {
  const buildSha = import.meta.env.STORYBOOK_PREVIEW || __BUILD_SHA__ === undefined ? 'n/a' : __BUILD_SHA__
  const buildTime = import.meta.env.STORYBOOK_PREVIEW || __BUILD_TIME__ === undefined ? 'n/a' : __BUILD_TIME__

  return (
    <SettingsDropdownItem variant="footnote">
      <div className="text-basics-dark-grey fill-basics-dark-grey flex flex-row items-center gap-1 text-[9px]">
        Built from {buildSha} at {buildTime}
      </div>
    </SettingsDropdownItem>
  )
}
