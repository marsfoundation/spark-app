import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { links } from '@/ui/constants/links'

import { SettingsDropdownItem } from './SettingsDropdownItem'

export function BuildInfoItem() {
  const buildSha = import.meta.env.STORYBOOK_PREVIEW || __BUILD_SHA__ === undefined ? 'n/a' : __BUILD_SHA__
  const buildTime = import.meta.env.STORYBOOK_PREVIEW || __BUILD_TIME__ === undefined ? 'n/a' : __BUILD_TIME__

  return (
    <LinkDecorator to={links.github} external>
      <SettingsDropdownItem variant="footnote">
        <div className="flex flex-row items-center gap-1 text-[9px] text-basics-dark-grey">
          Built from {buildSha} at {buildTime}
        </div>
      </SettingsDropdownItem>
    </LinkDecorator>
  )
}
