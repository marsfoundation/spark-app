import { useRef } from 'react'
import { Config } from 'wagmi'
import { connect } from 'wagmi/actions'

export interface UseAutoConnectParams {
  config: Config
}

export function useAutoConnect({ config }: UseAutoConnectParams): void {
  const firstRender = useRef(true)
  if (firstRender.current && config.connectors.length > 0) {
    firstRender.current = false
    void connect(config, {
      connector: config.connectors[0]!,
    })
  }
}
