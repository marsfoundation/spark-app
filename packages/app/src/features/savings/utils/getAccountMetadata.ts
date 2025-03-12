import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { links } from '@/ui/constants/links'
import { gnosis } from 'viem/chains'
import { AccountMetadata } from '../types'

export interface GetAccountMetadataArgs {
  underlyingToken: TokenSymbol
  chainId: number
}

export function getAccountMetadata({ underlyingToken, chainId }: GetAccountMetadataArgs): AccountMetadata {
  return {
    description: getAccountDescription({ underlyingToken, chainId }),
    apyExplainer: getApyExplainer({ underlyingToken, chainId }),
    descriptionDocsLink: getDocsLink({ underlyingToken, chainId }),
    apyExplainerDocsLink: getDocsLink({ underlyingToken, chainId }),
  }
}

function getAccountDescription({ underlyingToken, chainId }: GetAccountMetadataArgs): string {
  if (chainId === gnosis.id) {
    return 'Deposit your stablecoins into XDAI\u00A0Savings to tap into the DAI\u00A0Savings\u00A0Rate, which grants you a predictable APY in XDAI.'
  }
  if (underlyingToken === TokenSymbol('DAI')) {
    return 'Deposit your stablecoins into DAI\u00A0Savings to tap into the DAI\u00A0Savings\u00A0Rate, which grants you a predictable APY in DAI.'
  }
  return `Deposit your stablecoins into ${underlyingToken}\u00A0Savings to tap into the Sky\u00A0Savings\u00A0Rate, which grants you a predictable APY in ${underlyingToken}.`
}

function getApyExplainer({ underlyingToken, chainId }: GetAccountMetadataArgs): string {
  if (chainId === gnosis.id) {
    return 'All interest from the xDAI Bridge on the Ethereum mainnet is being redirected to Gnosis sDAI. The bridge converts its DAI deposits into DAI Savings on the mainnet, which then accumulates the DSR. The DSR is set on mainnet by Sky Ecosystem Governance. Keep in mind that these protocol mechanisms are subject to change.'
  }
  if (underlyingToken === TokenSymbol('DAI')) {
    return 'Current annual interest rate for DAI deposited into the Sky Savings Module. It is determined on-chain by the Sky Ecosystem Governance. Please note that these protocol mechanisms are subject to change.'
  }
  return 'Current annual interest in the Sky Savings Module. It is determined on-chain by the Sky Ecosystem Governance. Please note that these protocol mechanisms are subject to change.'
}

function getDocsLink({ underlyingToken, chainId }: GetAccountMetadataArgs): string {
  if (chainId === gnosis.id) {
    return links.docs.savings.gnosisSdai
  }
  if (underlyingToken === TokenSymbol('DAI')) {
    return links.docs.savings.sdai
  }
  if (underlyingToken === TokenSymbol('USDC')) {
    return links.docs.savings.susdc
  }
  return links.docs.savings.susds
}
