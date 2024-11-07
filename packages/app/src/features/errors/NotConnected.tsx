import { Button } from '@/ui/atoms/new/button/Button'
import { Typography } from '@/ui/atoms/typography/Typography'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useNavigate } from 'react-router-dom'
import { useAccountEffect } from 'wagmi'

export function NotConnected({ fullScreen }: { fullScreen?: boolean }) {
  const { openConnectModal } = useConnectModal()
  const navigate = useNavigate()
  useAccountEffect({
    onConnect: () => {
      navigate(0)
    },
  })

  return (
    <ErrorLayout fullScreen={fullScreen}>
      <Typography variant="h3">This page is available ony for connected users</Typography>
      <Button onClick={openConnectModal}>Connect wallet</Button>
    </ErrorLayout>
  )
}
