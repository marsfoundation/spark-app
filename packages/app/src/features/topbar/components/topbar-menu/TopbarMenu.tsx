import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { Link } from '@/ui/atoms/link/Link'
import { MenuItem, MenuItemIcon } from '@/ui/atoms/menu-item/MenuItem'
import { Switch } from '@/ui/atoms/switch/Switch'
import { links } from '@/ui/constants/links'
import { BuildInfo } from '@/ui/utils/getBuildInfo'
import { ExternalLinkIcon, MenuIcon, ScrollTextIcon, WandIcon } from 'lucide-react'
import { useState } from 'react'
import { TopbarAirdropProps } from '../topbar-airdrop/TopbarAirdrop'
import { TopbarRewardsProps } from '../topbar-rewards/TopbarRewards'
import { TopbarMenuAirdropItem } from './components/TopbarMenuAirdropItem'
import { TopbarMenuRewardsItem } from './components/TopbarMenuRewardsItem'

export interface TopbarMenuProps {
  onSandboxModeClick: () => void
  isInSandbox: boolean
  isMobileDisplay: boolean
  buildInfo: BuildInfo
  rewardsInfo: TopbarRewardsProps
  airdropInfo: TopbarAirdropProps
}

export function TopbarMenu({
  isInSandbox,
  onSandboxModeClick,
  buildInfo,
  isMobileDisplay,
  rewardsInfo,
  airdropInfo,
}: TopbarMenuProps) {
  const [open, setOpen] = useState(false)

  const { sha = 'n/a', buildTime = 'n/a' } = buildInfo

  const triggerButton = <IconButton icon={MenuIcon} variant="tertiary" size="m" />

  if (isMobileDisplay) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent overlayVariant="default" contentVerticalPosition="bottom" className="p-0">
          <DialogTitle className="border-primary border-b p-5 pt-6">Menu</DialogTitle>

          <TopbarMenuRewardsItem {...rewardsInfo} />

          <TopbarMenuAirdropItem {...airdropInfo} />

          <MenuItem
            variant="secondary"
            className="cursor-pointer flex-col items-start rounded-none p-6"
            onClick={onSandboxModeClick}
            withSeparator
          >
            <div className="flex w-full items-center gap-2">
              <MenuItemIcon icon={WandIcon} />
              Sandbox Mode
              <Switch checked={isInSandbox} className="ml-auto" />
            </div>
            <div className="typography-label-3 text-secondary">
              Explore Spark with <br />
              unlimited tokens
            </div>
          </MenuItem>

          <MenuItem asChild variant="secondary" className="cursor-pointer rounded-none p-6" withSeparator>
            <Link to={links.termsOfUse} variant="unstyled" external>
              <MenuItemIcon icon={ScrollTextIcon} />
              Terms of Service
              <DropdownMenuItemIcon icon={ExternalLinkIcon} className="ml-auto" />
            </Link>
          </MenuItem>

          <Link
            to={links.github}
            variant="unstyled"
            external
            className="typography-label-4 bg-secondary p-6 text-center text-secondary"
          >
            Built from {sha} at {buildTime}
          </Link>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
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
            <Switch checked={isInSandbox} className="ml-auto" />
          </div>
          <div className="typography-label-3 text-secondary">
            Explore Spark with <br />
            unlimited tokens
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild variant="secondary" className="cursor-pointer py-6">
          <Link to={links.termsOfUse} variant="unstyled" external>
            <DropdownMenuItemIcon icon={ScrollTextIcon} />
            Terms of Service
            <DropdownMenuItemIcon icon={ExternalLinkIcon} className="ml-auto" />
          </Link>
        </DropdownMenuItem>

        <Link
          to={links.github}
          variant="unstyled"
          external
          className="typography-label-4 p-5 text-center text-secondary"
        >
          Built from {sha} at {buildTime}
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

TopbarMenu.displayName = 'TopbarMenu'
