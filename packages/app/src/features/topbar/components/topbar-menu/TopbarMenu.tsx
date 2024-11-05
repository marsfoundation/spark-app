import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { ButtonWithIcon } from '@/ui/atoms/new/button-with-icon/ButtonWithIcon'
import { Switch } from '@/ui/atoms/new/switch/Switch'
import { links } from '@/ui/constants/links'
import { BuildInfo } from '@/ui/utils/getBuildInfo'
import { cn } from '@/ui/utils/style'
import { ExternalLinkIcon, MenuIcon, ScrollTextIcon, WandIcon } from 'lucide-react'
import { useState } from 'react'

export interface TopbarMenuProps {
  onSandboxModeClick: () => void
  isSandboxEnabled: boolean
  buildInfo: BuildInfo
}

export function TopbarMenu({ isSandboxEnabled, onSandboxModeClick, buildInfo }: TopbarMenuProps) {
  const [open, setOpen] = useState(false)

  const { sha = 'n/a', buildTime = 'n/a' } = buildInfo

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ButtonWithIcon icon={MenuIcon} variant="tertiary" className={cn(open && 'text-brand')} size="m" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" variant="secondary" className="flex w-80 flex-col gap-1.5 p-1">
        <DropdownMenuItem
          variant="secondary"
          className="cursor-pointer flex-col items-start py-5"
          onSelect={(event) => {
            onSandboxModeClick()
            // @note prevents dropdown from collapse on switch click
            event.preventDefault()
          }}
        >
          <div className="flex w-full items-center gap-2">
            <DropdownMenuItemIcon icon={WandIcon} />
            Sandbox Mode
            <Switch checked={isSandboxEnabled} className="ml-auto" />
          </div>
          <div className="typography-label-5 text-secondary">
            Explore Spark with <br />
            unlimited tokens
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild variant="secondary" className="py-6">
          <Link to={links.termsOfUse} external className="!text-primary cursor-pointer">
            <DropdownMenuItemIcon icon={ScrollTextIcon} />
            Terms of Service
            <DropdownMenuItemIcon icon={ExternalLinkIcon} className="ml-auto" />
          </Link>
        </DropdownMenuItem>

        <Link to={links.github} external className="typography-label-6 !text-secondary p-5 text-center">
          Built from {sha} at {buildTime}
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

TopbarMenu.displayName = 'TopbarMenu'
