import { useNavigate } from 'react-router-dom'
import { useAccountEffect } from 'wagmi'

import { Button } from '@/ui/atoms/button/Button'
import { Typography } from '@/ui/atoms/typography/Typography'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export function NotConnected({ fullScreen }: { fullScreen?: boolean }) {
  const { setShowAuthFlow } = useDynamicContext()
  const navigate = useNavigate()
  useAccountEffect({
    onConnect: () => {
      navigate(0)
    },
  })

  return (
    <ErrorLayout fullScreen={fullScreen}>
      <Typography variant="h3">This page is available ony for connected users</Typography>
      <Button onClick={() => setShowAuthFlow(true)}>Connect wallet</Button>
    </ErrorLayout>
  )
}
