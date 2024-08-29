import MagicWand from '@/ui/assets/magic-wand.svg?react'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { BuildInfoItem } from './BuildInfoItem'
import { SettingsDropdownItem } from './SettingsDropdownItem'

export interface SettingsDropdownProps {
  onSandboxModeClick: () => void
  isSandboxEnabled: boolean
  onDevSandBoxModeClick: () => void
  isDevSandboxEnabled: boolean
}

export function SettingsDropdown({
  onSandboxModeClick,
  isSandboxEnabled,
  onDevSandBoxModeClick,
  isDevSandboxEnabled,
}: SettingsDropdownProps) {
  return (
    <NavbarActionWrapper label="Other">
      <DropdownWrapper>
        {isSandboxEnabled && (
          <SettingsDropdownItem onClick={onSandboxModeClick}>
            <SettingsDropdownItem.Title>
              <MagicWand className="h-5 w-5 lg:h-3 lg:w-3" />
              Sandbox Mode
            </SettingsDropdownItem.Title>
            <SettingsDropdownItem.Content>
              Explore Spark <br /> with unlimited tokens
            </SettingsDropdownItem.Content>
          </SettingsDropdownItem>
        )}

        {isDevSandboxEnabled && (
          <SettingsDropdownItem onClick={onDevSandBoxModeClick}>
            <SettingsDropdownItem.Title>
              <MagicWand className="h-5 w-5 lg:h-3 lg:w-3" />
              Dev Sandbox Mode
            </SettingsDropdownItem.Title>
            <SettingsDropdownItem.Content>
              Debug Spark <br /> with unlimited tokens
            </SettingsDropdownItem.Content>
          </SettingsDropdownItem>
        )}

        <Link to="https://spark.fi/terms-of-use.html" external>
          <SettingsDropdownItem>
            <SettingsDropdownItem.Content>Terms of Service</SettingsDropdownItem.Content>
          </SettingsDropdownItem>
        </Link>

        <Link to="https://legacy-app.spark.fi/" external>
          <SettingsDropdownItem>
            <SettingsDropdownItem.Content>Legacy interface</SettingsDropdownItem.Content>
          </SettingsDropdownItem>
        </Link>

        <div>
          <DropdownMenuSeparator />
          <BuildInfoItem />
        </div>
      </DropdownWrapper>
    </NavbarActionWrapper>
  )
}

function DropdownWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = !useBreakpoint('lg')

  if (isMobile) {
    return <div className="flex flex-col gap-4">{children}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="bg-white px-3">
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
