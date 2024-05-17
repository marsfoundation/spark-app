import { Page } from '@playwright/test'
import assert from 'assert'
import { Address } from 'viem'

export interface LiFiParams {
  slippage: number
}

export const defaultLiFiParams: LiFiParams = {
  slippage: 0.001,
}
export interface OverrideLiFiRouteOptions {
  receiver: Address
  preset: keyof typeof lifiResponses
  expectedBlockNumber: bigint
  expectedParams?: LiFiParams
}

export async function overrideLiFiRoute(
  page: Page,
  { receiver, preset, expectedBlockNumber, expectedParams }: OverrideLiFiRouteOptions,
): Promise<void> {
  const presetValue = lifiResponses[preset]

  assert(
    presetValue.block === expectedBlockNumber,
    `preset ${preset}(${presetValue.block}) is not available at block ${expectedBlockNumber}`,
  )
  const params = expectedParams ?? defaultLiFiParams
  const endpoint = matchUrl(presetValue.endpoint, presetValue.method === 'GET' ? lifiParamsToUrl(params) : {})

  await page.route(endpoint, async (route) => {
    // @todo: parse body of POST request and check if it matches the expected params
    await route.fulfill({
      json: presetValue.response(receiver, params.slippage),
    })
  })
}

// note: url might contain extra params
function matchUrl(expectedUrl: string, expectedParams: Record<string, string>): (actualUrl: URL) => boolean {
  return (url) => {
    if (`${url.protocol}//${url.host}${url.pathname}` !== expectedUrl) {
      return false
    }

    const urlParams = new URLSearchParams(url.search)
    for (const [key, value] of Object.entries(expectedParams)) {
      if (urlParams.get(key) !== value) {
        return false
      }
    }
    return true
  }
}

function lifiParamsToUrl(params: LiFiParams): Record<string, string> {
  return {
    slippage: params.slippage.toString(),
  }
}

const lifiResponses = {
  '100-dai-to-sdai': {
    // curl --request GET \
    //  --url 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0x6B175474E89094C44Da98b954EedeAC495271d0F&toToken=0x83f20f44975d03b1b09e64809b757c47f942beea&fromAddress=0x68F6148E28Ded21f92bBA55Ab1d2b39DBa0726b2&fromAmount=100000000000000000000' \
    //  --header 'accept: application/json'
    block: 19519583n,
    endpoint: 'https://li.quest/v1/quote',
    method: 'GET',
    response: (receiver, slippage) => ({
      type: 'lifi',
      id: 'f5532701-e8b5-4456-a932-7bdf313bd31f',
      tool: '0x',
      toolDetails: {
        key: '0x',
        name: '0x',
        logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
      },
      action: {
        fromToken: {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          chainId: 1,
          symbol: 'DAI',
          decimals: 18,
          name: 'DAI Stablecoin',
          coinKey: 'DAI',
          logoURI:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
          priceUSD: '0.99985',
        },
        fromAmount: '100000000000000000000',
        toToken: {
          address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
          chainId: 1,
          symbol: 'sDAI',
          decimals: 18,
          name: 'Savings Dai',
          coinKey: 'sDAI',
          logoURI:
            'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
          priceUSD: '1.0655224570504276',
        },
        fromChainId: 1,
        toChainId: 1,
        slippage,
        fromAddress: receiver,
        toAddress: receiver,
      },
      estimate: {
        tool: '0x',
        approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        toAmountMin: '94929384388286060032',
        toAmount: '95406416470639256314',
        fromAmount: '100000000000000000000',
        feeCosts: [],
        gasCosts: [
          {
            type: 'SEND',
            price: '37456621733',
            estimate: '315192',
            limit: '409750',
            amount: '11806027517267736',
            amountUSD: '42.90',
            token: {
              address: '0x0000000000000000000000000000000000000000',
              chainId: 1,
              symbol: 'ETH',
              decimals: 18,
              name: 'ETH',
              coinKey: 'ETH',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
              priceUSD: '3634.1',
            },
          },
        ],
        executionDuration: 30,
        fromAmountUSD: '99.99',
        toAmountUSD: '101.66',
      },
      includedSteps: [
        {
          id: '9d810c63-d619-45c3-833e-28f79356b7b8',
          type: 'swap',
          action: {
            fromChainId: 1,
            fromAmount: '100000000000000000000',
            fromToken: {
              address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
              chainId: 1,
              symbol: 'DAI',
              decimals: 18,
              name: 'DAI Stablecoin',
              coinKey: 'DAI',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
              priceUSD: '0.99985',
            },
            toChainId: 1,
            toToken: {
              address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
              chainId: 1,
              symbol: 'sDAI',
              decimals: 18,
              name: 'Savings Dai',
              coinKey: 'sDAI',
              logoURI:
                'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
              priceUSD: '1.0655224570504276',
            },
            slippage,
            fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          },
          estimate: {
            tool: '0x',
            fromAmount: '100000000000000000000',
            toAmount: '95406416470639256314',
            toAmountMin: '94929384388286060032',
            approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
            executionDuration: 30,
            feeCosts: [],
            gasCosts: [
              {
                type: 'SEND',
                price: '37456621733',
                estimate: '164572',
                limit: '213944',
                amount: '6164311151843276',
                amountUSD: '22.40',
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  chainId: 1,
                  symbol: 'ETH',
                  decimals: 18,
                  name: 'ETH',
                  coinKey: 'ETH',
                  logoURI:
                    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  priceUSD: '3634.1',
                },
              },
            ],
          },
          tool: '0x',
          toolDetails: {
            key: '0x',
            name: '0x',
            logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
          },
        },
      ],
      integrator: 'lifi-staging-api',
      transactionRequest: {
        data: `0x4630a0d8e0b36304d9cf4b4cf2349d34092d7d0943ff49c3534aeeb53c87b8ee6e88c32300000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000052568ec24ca4d9600000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000106c6966692d73746167696e672d61706900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea0000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001486af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000052568ec24ca4d9600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000426b175474e89094c44da98b954eedeac495271d0f0001f4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f483f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000085dffaf5b75f3cb609a1c6e535df7b9d09db90e90000000000000000000000000000000002ae7f9ed49da5296f97fe6706bc58d9000000000000000000000000000000000000000000000000`,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0x8b896b0a5',
        gasLimit: '0x64096',
        from: receiver,
        chainId: 1,
      },
    }),
  },
  '100-usdc-to-sdai': {
    // curl --request GET \
    //  --url 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&toToken=0x83F20F44975D03b1b09e64809B757c47f942BEeA&fromAddress=0x68F6148E28Ded21f92bBA55Ab1d2b39DBa0726b2&fromAmount=100000000' \
    //  --header 'accept: application/json'
    block: 19519583n,
    endpoint: 'https://li.quest/v1/quote',
    method: 'GET',
    response: (receiver, slippage) => ({
      type: 'lifi',
      id: 'd17517a7-7d84-4fe8-9247-bf2b2e982649',
      tool: '0x',
      toolDetails: {
        key: '0x',
        name: '0x',
        logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
      },
      action: {
        fromToken: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          chainId: 1,
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
          coinKey: 'USDC',
          logoURI:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
          priceUSD: '1',
        },
        fromAmount: '100000000',
        toToken: {
          address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
          chainId: 1,
          symbol: 'sDAI',
          decimals: 18,
          name: 'Savings Dai',
          coinKey: 'sDAI',
          logoURI:
            'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
          priceUSD: '1.0655224570504276',
        },
        fromChainId: 1,
        toChainId: 1,
        slippage,
        fromAddress: receiver,
        toAddress: receiver,
      },
      estimate: {
        tool: '0x',
        approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        toAmountMin: '95768761649071870400',
        toAmount: '96250011707609920000',
        fromAmount: '100000000',
        feeCosts: [],
        gasCosts: [
          {
            type: 'SEND',
            price: '53738910166',
            estimate: '347293',
            limit: '451481',
            amount: '18663147328280638',
            amountUSD: '67.82',
            token: {
              address: '0x0000000000000000000000000000000000000000',
              chainId: 1,
              symbol: 'ETH',
              decimals: 18,
              name: 'ETH',
              coinKey: 'ETH',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
              priceUSD: '3634.1',
            },
          },
        ],
        executionDuration: 30,
        fromAmountUSD: '100.00',
        toAmountUSD: '102.56',
      },
      includedSteps: [
        {
          id: '24114fcc-c565-4d65-bfff-f6d65f2b6158',
          type: 'swap',
          action: {
            fromChainId: 1,
            fromAmount: '100000000',
            fromToken: {
              address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              chainId: 1,
              symbol: 'USDC',
              decimals: 6,
              name: 'USD Coin',
              coinKey: 'USDC',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
              priceUSD: '1',
            },
            toChainId: 1,
            toToken: {
              address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
              chainId: 1,
              symbol: 'sDAI',
              decimals: 18,
              name: 'Savings Dai',
              coinKey: 'sDAI',
              logoURI:
                'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
              priceUSD: '1.0655224570504276',
            },
            slippage,
            fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          },
          estimate: {
            tool: '0x',
            fromAmount: '100000000',
            toAmount: '96250011707609920000',
            toAmountMin: '95768761649071870400',
            approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
            executionDuration: 30,
            feeCosts: [],
            gasCosts: [
              {
                type: 'SEND',
                price: '53738910166',
                estimate: '165578',
                limit: '215251',
                amount: '8897981267465948',
                amountUSD: '32.34',
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  chainId: 1,
                  symbol: 'ETH',
                  decimals: 18,
                  name: 'ETH',
                  coinKey: 'ETH',
                  logoURI:
                    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  priceUSD: '3634.1',
                },
              },
            ],
          },
          tool: '0x',
          toolDetails: {
            key: '0x',
            name: '0x',
            logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
          },
        },
      ],
      integrator: 'lifi-staging-api',
      transactionRequest: {
        data: `0x4630a0d83fad674073f4afbd0ea18bab0027e31da1ecc3f6166f5419f3da189c0e94f3ca00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
          .slice(2)
          .toLowerCase()}000000000000000000000000000000000000000000000005310efd50affb51c0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000106c6966692d73746167696e672d61706900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea0000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001486af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000000000000000000000000005310efd50affb51c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480001f4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f483f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000085dffaf5b75f3cb609a1c6e535df7b9d09db90e90000000000000000000000000000000037e36e6b33bcf327abb279b154820a4a000000000000000000000000000000000000000000000000`,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0xc8316b1d6',
        gasLimit: '0x6e399',
        from: receiver,
        chainId: 1,
      },
    }),
  },
  'sdai-to-100-dai': {
    //curl --request POST \
    //  --url https://li.quest/v1/quote/contractCalls \
    //  --header 'accept: application/json' \
    //  --header 'content-type: application/json' \
    //  --data '
    // {
    //  "fromChain": 1,
    //  "toChain": 1,
    //  "toToken": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    //  "fromToken": "0x83f20f44975d03b1b09e64809b757c47f942beea",
    //  "fromAddress": "0x68F6148E28Ded21f92bBA55Ab1d2b39DBa0726b2",
    //  "toAmount": "100000000000000000000",
    //  "contractCalls": []
    // }
    // '
    block: 19532848n,
    endpoint: 'https://li.quest/v1/quote/contractCalls',
    method: 'POST',
    response: (receiver, slippage) => ({
      type: 'lifi',
      id: 'd9b0de53-c14e-4d06-8493-fa72fbdf10a5',
      tool: '0x',
      toolDetails: {
        key: '0x',
        name: '0x',
        logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
      },
      action: {
        fromToken: {
          address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
          chainId: 1,
          symbol: 'sDAI',
          decimals: 18,
          name: 'Savings Dai',
          coinKey: 'sDAI',
          logoURI:
            'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
          priceUSD: '1.0663514131583727',
        },
        fromAmount: '94333686373664217775',
        toToken: {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          chainId: 1,
          symbol: 'DAI',
          decimals: 18,
          name: 'DAI Stablecoin',
          coinKey: 'DAI',
          logoURI:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
          priceUSD: '0.99985',
        },
        fromChainId: 1,
        toChainId: 1,
        slippage,
        fromAddress: receiver,
        toAddress: receiver,
      },
      estimate: {
        tool: '0x',
        approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        toAmountMin: '100047820489544523714',
        toAmount: '100550573356326154486',
        fromAmount: '94333686373664217775',
        feeCosts: [],
        gasCosts: [
          {
            type: 'SEND',
            price: '41109586394',
            estimate: '407368',
            limit: '529578',
            amount: '16746729990150992',
            amountUSD: '59.90',
            token: {
              address: '0x0000000000000000000000000000000000000000',
              chainId: 1,
              symbol: 'ETH',
              decimals: 18,
              name: 'ETH',
              coinKey: 'ETH',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
              priceUSD: '3576.94',
            },
          },
        ],
        executionDuration: 30,
        fromAmountUSD: '100.59',
        toAmountUSD: '100.54',
      },
      includedSteps: [
        {
          id: '59b56db9-70d7-41f7-8f64-579b1534d434',
          type: 'swap',
          action: {
            fromChainId: 1,
            fromAmount: '94333686373664217775',
            fromToken: {
              address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
              chainId: 1,
              symbol: 'sDAI',
              decimals: 18,
              name: 'Savings Dai',
              coinKey: 'sDAI',
              logoURI:
                'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
              priceUSD: '1.0663514131583727',
            },
            toChainId: 1,
            toToken: {
              address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
              chainId: 1,
              symbol: 'DAI',
              decimals: 18,
              name: 'DAI Stablecoin',
              coinKey: 'DAI',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
              priceUSD: '0.99985',
            },
            slippage,
            fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          },
          estimate: {
            tool: '0x',
            fromAmount: '94333686373664217775',
            toAmount: '100550573356326154486',
            toAmountMin: '100047820489544523714',
            approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
            executionDuration: 30,
            feeCosts: [],
            gasCosts: [
              {
                type: 'SEND',
                price: '41109586394',
                estimate: '164368',
                limit: '213678',
                amount: '6757100496408992',
                amountUSD: '24.17',
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  chainId: 1,
                  symbol: 'ETH',
                  decimals: 18,
                  name: 'ETH',
                  coinKey: 'ETH',
                  logoURI:
                    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  priceUSD: '3576.94',
                },
              },
            ],
          },
          tool: '0x',
          toolDetails: {
            key: '0x',
            name: '0x',
            logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
          },
        },
      ],
      transactionRequest: {
        data: `0x4630a0d826f928330778c38f79e92fd335fa08184b0aabd08c4521598cd8f369319b981200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000056c7142a8bf595fc2000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000086c6966692d617069000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000051d2493f49f5cdaaf00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001486af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000051d2493f49f5cdaaf0000000000000000000000000000000000000000000000056c7142a8bf595fc10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004283f20f44975d03b1b09e64809b757c47f942beea0001f4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb86b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000026c16b6926637cf5eb62c42991b4166add66ff9e00000000000000000000000000000000bc3a3021d9d7789380d9816cba5d78c8000000000000000000000000000000000000000000000000`,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0x9925281da',
        gasLimit: '0x814aa',
        from: receiver,
        chainId: 1,
      },
    }),
  },
  'sdai-to-100-usdc': {
    // curl --request POST \
    //   --url https://li.quest/v1/quote/contractCalls \
    //   --header 'accept: application/json' \
    //   --header 'content-type: application/json' \
    //   --data '
    // {
    //  "fromChain": 1,
    //  "toChain": 1,
    //  "toToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    //  "fromToken": "0x83f20f44975d03b1b09e64809b757c47f942beea",
    //  "fromAddress": "0x68F6148E28Ded21f92bBA55Ab1d2b39DBa0726b2",
    //  "toAmount": "100000000",
    //  "contractCalls": []
    // }
    // '
    block: 19532848n,
    endpoint: 'https://li.quest/v1/quote/contractCalls',
    method: 'POST',
    response: (receiver: Address, slippage: number) => ({
      type: 'lifi',
      id: 'e77c69b1-f5ff-41e5-9e48-767cf0d9553b',
      tool: '0x',
      toolDetails: {
        key: '0x',
        name: '0x',
        logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
      },
      action: {
        fromToken: {
          address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
          chainId: 1,
          symbol: 'sDAI',
          decimals: 18,
          name: 'Savings Dai',
          coinKey: 'sDAI',
          logoURI:
            'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
          priceUSD: '1.0663514131583727',
        },
        fromAmount: '94313301490401710213',
        toToken: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          chainId: 1,
          symbol: 'USDC',
          decimals: 6,
          name: 'USD Coin',
          coinKey: 'USDC',
          logoURI:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
          priceUSD: '1',
        },
        fromChainId: 1,
        toChainId: 1,
        slippage,
        fromAddress: receiver,
        toAddress: receiver,
      },
      estimate: {
        tool: '0x',
        approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        toAmountMin: '100274668',
        toAmount: '100778561',
        fromAmount: '94313301490401710213',
        feeCosts: [],
        gasCosts: [
          {
            type: 'SEND',
            price: '41109586394',
            estimate: '407526',
            limit: '529784',
            amount: '16753225304801244',
            amountUSD: '59.93',
            token: {
              address: '0x0000000000000000000000000000000000000000',
              chainId: 1,
              symbol: 'ETH',
              decimals: 18,
              name: 'ETH',
              coinKey: 'ETH',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
              priceUSD: '3576.94',
            },
          },
        ],
        executionDuration: 30,
        fromAmountUSD: '100.57',
        toAmountUSD: '100.78',
      },
      includedSteps: [
        {
          id: '9a0a9c28-bb76-4f6c-9ce8-231b8e78b41a',
          type: 'swap',
          action: {
            fromChainId: 1,
            fromAmount: '94313301490401710213',
            fromToken: {
              address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
              chainId: 1,
              symbol: 'sDAI',
              decimals: 18,
              name: 'Savings Dai',
              coinKey: 'sDAI',
              logoURI:
                'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
              priceUSD: '1.0663514131583727',
            },
            toChainId: 1,
            toToken: {
              address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              chainId: 1,
              symbol: 'USDC',
              decimals: 6,
              name: 'USD Coin',
              coinKey: 'USDC',
              logoURI:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
              priceUSD: '1',
            },
            slippage,
            fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          },
          estimate: {
            tool: '0x',
            fromAmount: '94313301490401710213',
            toAmount: '100778561',
            toAmountMin: '100274668',
            approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
            executionDuration: 30,
            feeCosts: [],
            gasCosts: [
              {
                type: 'SEND',
                price: '41109586394',
                estimate: '164526',
                limit: '213884',
                amount: '6763595811059244',
                amountUSD: '24.19',
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  chainId: 1,
                  symbol: 'ETH',
                  decimals: 18,
                  name: 'ETH',
                  coinKey: 'ETH',
                  logoURI:
                    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  priceUSD: '3576.94',
                },
              },
            ],
          },
          tool: '0x',
          toolDetails: {
            key: '0x',
            name: '0x',
            logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
          },
        },
      ],
      transactionRequest: {
        data: `0x4630a0d8ecb31daaf34c1e81ae04200497b15487c84f9384395935163aebf0123c0cb8d500000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000000000000005fa11ec000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000086c6966692d617069000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000051cdc280321b6908500000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001486af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000051cdc280321b690850000000000000000000000000000000000000000000000000000000005fa11ec0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004283f20f44975d03b1b09e64809b757c47f942beea0001f4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000026c16b6926637cf5eb62c42991b4166add66ff9e00000000000000000000000000000000ec9aee100aa2701e94c1b24e01f386c9000000000000000000000000000000000000000000000000`,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0x9925281da',
        gasLimit: '0x81578',
        from: receiver,
        chainId: 1,
      },
    }),
  },
  '100-sdai-to-dai': {
    //curl 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromAddress=0x8Ae54247ABee903Ea866b012394919112668b93f&fromToken=0x83F20F44975D03b1b09e64809B757c47f942BEeA&fromAmount=100000000000000000000&toToken=0x6B175474E89094C44Da98b954EedeAC495271d0F&integrator=spark_waivefee&fee=0'
    endpoint: 'https://li.quest/v1/quote',
    block: 19609252n,
    method: 'GET',
    response(receiver, slippage) {
      return {
        type: 'lifi',
        id: '63342924-24ac-49cf-ba3f-75f1bd696794',
        tool: '0x',
        toolDetails: {
          key: '0x',
          name: '0x',
          logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
        },
        action: {
          fromToken: {
            address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
            chainId: 1,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings Dai',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
            priceUSD: '1.0702376481177662',
          },
          fromAmount: '100000000000000000000',
          toToken: {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            chainId: 1,
            symbol: 'DAI',
            decimals: 18,
            name: 'DAI Stablecoin',
            coinKey: 'DAI',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '0.99985',
          },
          fromChainId: 1,
          toChainId: 1,
          slippage,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: '0x',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '106406782691975684350',
          toAmount: '106941490142689130000',
          fromAmount: '100000000000000000000',
          feeCosts: [],
          gasCosts: [
            {
              type: 'SEND',
              price: '9901179375',
              estimate: '407364',
              limit: '529573',
              amount: '4033384034917500',
              amountUSD: '13.81',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 1,
                symbol: 'ETH',
                decimals: 18,
                name: 'ETH',
                coinKey: 'ETH',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                priceUSD: '3424.73',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '107.02',
          toAmountUSD: '106.93',
        },
        includedSteps: [
          {
            id: 'fcead0a5-6af8-48cb-a5b8-d4440467094e',
            type: 'swap',
            action: {
              fromChainId: 1,
              fromAmount: '100000000000000000000',
              fromToken: {
                address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
                chainId: 1,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings Dai',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
                priceUSD: '1.0702376481177662',
              },
              toChainId: 1,
              toToken: {
                address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                chainId: 1,
                symbol: 'DAI',
                decimals: 18,
                name: 'DAI Stablecoin',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99985',
              },
              slippage,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: '0x',
              fromAmount: '100000000000000000000',
              toAmount: '106941490142689130000',
              toAmountMin: '106406782691975684350',
              approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '9901179375',
                  estimate: '164364',
                  limit: '213673',
                  amount: '1627397446792500',
                  amountUSD: '5.57',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 1,
                    symbol: 'ETH',
                    decimals: 18,
                    name: 'ETH',
                    coinKey: 'ETH',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                    priceUSD: '3424.73',
                  },
                },
              ],
            },
            tool: '0x',
            toolDetails: {
              key: '0x',
              name: '0x',
              logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
            },
          },
        ],
        integrator: 'spark_waivefee',
        transactionRequest: {
          data: `0x4630a0d8c41b1bacc95222bbbc36d075a7db4b7c87baa6be9df678748a113ac054b44c3200000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
            .slice(2)
            .toLowerCase()}000000000000000000000000000000000000000000000005c4b0d5174f64e0fe0000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000e737061726b5f7761697665666565000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001486af479b200000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000000000000000000000000005c4b0d5174f64e0fe0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004283f20f44975d03b1b09e64809b757c47f942beea0001f4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f46b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000026c16b6926637cf5eb62c42991b4166add66ff9e0000000000000000000000000000000083941c9bcc4296886f9db0b01557a9f4000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x24e2801ef',
          gasLimit: '0x814a5',
          from: receiver,
          chainId: 1,
        },
      }
    },
  },
  '100-sdai-to-usdc': {
    // curl 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromAddress=0x908901d03233B43109fBbbc8D3b91C66e2a8867F&fromToken=0x83F20F44975D03b1b09e64809B757c47f942BEeA&fromAmount=100000000000000000000&toToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&integrator=spark_waivefee&fee=0'
    endpoint: 'https://li.quest/v1/quote',
    block: 19609941n,
    method: 'GET',
    response(receiver, slippage) {
      return {
        type: 'lifi',
        id: '7d94822b-ede1-4697-90c2-54c271289270',
        tool: '0x',
        toolDetails: {
          key: '0x',
          name: '0x',
          logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
        },
        action: {
          fromToken: {
            address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
            chainId: 1,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings Dai',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
            priceUSD: '1.0702778649862865',
          },
          fromAmount: '100000000000000000000',
          toToken: {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            chainId: 1,
            symbol: 'USDC',
            decimals: 6,
            name: 'USD Coin',
            coinKey: 'USDC',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            priceUSD: '1',
          },
          fromChainId: 1,
          toChainId: 1,
          slippage,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: '0x',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '106819553',
          toAmount: '107356335',
          fromAmount: '100000000000000000000',
          feeCosts: [],
          gasCosts: [
            {
              type: 'SEND',
              price: '21486882057',
              estimate: '399000',
              limit: '518700',
              amount: '8573265940743000',
              amountUSD: '30.84',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 1,
                symbol: 'ETH',
                decimals: 18,
                name: 'ETH',
                coinKey: 'ETH',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                priceUSD: '3596.79',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '107.03',
          toAmountUSD: '107.36',
        },
        includedSteps: [
          {
            id: '7f0f9ab2-5a2b-40f2-999f-180c369b1605',
            type: 'swap',
            action: {
              fromChainId: 1,
              fromAmount: '100000000000000000000',
              fromToken: {
                address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
                chainId: 1,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings Dai',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
                priceUSD: '1.0702778649862865',
              },
              toChainId: 1,
              toToken: {
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                chainId: 1,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              slippage,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: '0x',
              fromAmount: '100000000000000000000',
              toAmount: '107356335',
              toAmountMin: '106819553',
              approvalAddress: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '21486882057',
                  estimate: '156000',
                  limit: '202800',
                  amount: '3351953600892000',
                  amountUSD: '12.06',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 1,
                    symbol: 'ETH',
                    decimals: 18,
                    name: 'ETH',
                    coinKey: 'ETH',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                    priceUSD: '3596.79',
                  },
                },
              ],
            },
            tool: '0x',
            toolDetails: {
              key: '0x',
              name: '0x',
              logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.png',
            },
          },
        ],
        integrator: 'spark_waivefee',
        transactionRequest: {
          data: `0x4630a0d83ab2bc90cad639f2503ac25c83a1ca36018641c58543b74c677bf4f5182bb65000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver
            .slice(2)
            .toLowerCase()}00000000000000000000000000000000000000000000000000000000065defe10000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000e737061726b5f7761697665666565000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000148d9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000000000000065defe10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48869584cd00000000000000000000000026c16b6926637cf5eb62c42991b4166add66ff9e00000000000000000000000000000000e8e3520fd4bb8a5a5c83811bf56376f7000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x500b7cd09',
          gasLimit: '0x7ea2c',
          from: receiver,
          chainId: 1,
        },
      }
    },
  },
  '10000-dai-to-sdai': {
    // curl --request GET \
    //  --url 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0x6B175474E89094C44Da98b954EedeAC495271d0F&toToken=0x83f20f44975d03b1b09e64809b757c47f942beea&fromAddress=0x908901d03233B43109fBbbc8D3b91C66e2a8867F&fromAmount=10000000000000000000000&slippage=0.1' \
    //  --header 'accept: application/json'
    block: 19861465n,
    endpoint: 'https://li.quest/v1/quote',
    method: 'GET',
    response(receiver, slippage) {
      return {
        type: 'lifi',
        id: '706aebd2-832d-4a86-b119-d8e298d8b088',
        tool: 'enso',
        toolDetails: {
          key: 'enso',
          name: 'Enso',
          logoURI: 'https://www.enso.finance/favicon.ico',
        },
        action: {
          fromToken: {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            chainId: 1,
            symbol: 'DAI',
            decimals: 18,
            name: 'DAI Stablecoin',
            coinKey: 'DAI',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '0.99985',
          },
          fromAmount: '10000000000000000000000',
          toToken: {
            address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
            chainId: 1,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings Dai',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
            priceUSD: '1.0814717527682474',
          },
          fromChainId: 1,
          toChainId: 1,
          slippage,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: 'enso',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '8320604955114542838902',
          toAmount: '9245116616793936487669',
          fromAmount: '10000000000000000000000',
          feeCosts: [],
          gasCosts: [
            {
              type: 'SEND',
              price: '11565219039',
              estimate: '346765',
              limit: '450795',
              amount: '4010413180058835',
              amountUSD: '11.93',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 1,
                symbol: 'ETH',
                decimals: 18,
                name: 'ETH',
                coinKey: 'ETH',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                priceUSD: '2974.78',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '9998.50',
          toAmountUSD: '9998.33',
        },
        includedSteps: [
          {
            id: 'c04edde2-43b1-4541-8d77-049abdb395e0',
            type: 'swap',
            action: {
              fromChainId: 1,
              fromAmount: '10000000000000000000000',
              fromToken: {
                address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                chainId: 1,
                symbol: 'DAI',
                decimals: 18,
                name: 'DAI Stablecoin',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99985',
              },
              toChainId: 1,
              toToken: {
                address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
                chainId: 1,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings Dai',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
                priceUSD: '1.0814717527682474',
              },
              slippage,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: 'enso',
              fromAmount: '10000000000000000000000',
              toAmount: '9245116616793936487669',
              toAmountMin: '8320604955114542838902',
              approvalAddress: '0x80EbA3855878739F4710233A8a19d89Bdd2ffB8E',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '11565219039',
                  estimate: '233087',
                  limit: '303013',
                  amount: '2695702210143393',
                  amountUSD: '8.02',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 1,
                    symbol: 'ETH',
                    decimals: 18,
                    name: 'ETH',
                    coinKey: 'ETH',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                    priceUSD: '2974.78',
                  },
                },
              ],
            },
            tool: 'enso',
            toolDetails: {
              key: 'enso',
              name: 'Enso',
              logoURI: 'https://www.enso.finance/favicon.ico',
            },
          },
        ],
        integrator: 'lifi-api',
        transactionRequest: {
          data: `0x878863a4df2632c2ad0e8b58f0c977670dec013c2b488d74182ff67b0cda9405057e6dd100000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}0000000000000000000000000000000000000000000001c30f970a38e561b476000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000086c6966692d617069000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea00000000000000000000000000000000000000000000021e19e0c9bab240000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000002c4b35d7e730000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000021e19e0c9bab2400000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000004095ea7b3010001ffffffffff6b175474e89094c44da98b954eedeac495271d0f6e553f65010102ffffffff0283f20f44975d03b1b09e64809b757c47f942beea6e7a43a3010203ffffffff027e7d64d987cab6eed08a191c4c2459daf2f8ed0b241c59120102ffffffffffff7e7d64d987cab6eed08a191c4c2459daf2f8ed0b0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002000000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000021e19e0c9bab240000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000001c30f970a38e561b47600000000000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x2b1573cdf',
          gasLimit: '0x6e0eb',
          from: receiver,
          chainId: 1,
        },
      }
    },
  },
  'sdai-to-10000-dai': {
    block: 19862032n,
    endpoint: 'https://li.quest/v1/quote/contractCalls',
    method: 'POST',
    response(receiver, slippage) {
      return {
        type: 'lifi',
        id: '4d83433e-2359-45ee-8c67-fd85e01412d1',
        tool: 'enso',
        toolDetails: {
          key: 'enso',
          name: 'Enso',
          logoURI: 'https://www.enso.finance/favicon.ico',
        },
        action: {
          fromToken: {
            address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
            chainId: 1,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings Dai',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
            priceUSD: '1.081499326145947',
          },
          fromAmount: '10277276260680656857010',
          toToken: {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            chainId: 1,
            symbol: 'DAI',
            decimals: 18,
            name: 'DAI Stablecoin',
            coinKey: 'DAI',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '0.99985',
          },
          fromChainId: 1,
          toChainId: 1,
          slippage,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: 'enso',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '10004999999999999999920',
          toAmount: '11116666666666666666578',
          fromAmount: '10277276260680656857010',
          feeCosts: [],
          gasCosts: [
            {
              type: 'SEND',
              price: '21002754684',
              estimate: '440312',
              limit: '572406',
              amount: '9247764920421408',
              amountUSD: '27.36',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 1,
                symbol: 'ETH',
                decimals: 18,
                name: 'ETH',
                coinKey: 'ETH',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                priceUSD: '2958.61',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '11114.87',
          toAmountUSD: '11115.00',
        },
        includedSteps: [
          {
            id: 'a58b45c8-668e-4e93-9b4d-13061541cb44',
            type: 'swap',
            action: {
              fromChainId: 1,
              fromAmount: '10277276260680656857010',
              fromToken: {
                address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
                chainId: 1,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings Dai',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/ba710cd443d1995d6b4781ee6d5904c0.png',
                priceUSD: '1.081499326145947',
              },
              toChainId: 1,
              toToken: {
                address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                chainId: 1,
                symbol: 'DAI',
                decimals: 18,
                name: 'DAI Stablecoin',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99985',
              },
              slippage,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: 'enso',
              fromAmount: '10277276260680656857010',
              toAmount: '11116666666666666666578',
              toAmountMin: '10004999999999999999920',
              approvalAddress: '0x80EbA3855878739F4710233A8a19d89Bdd2ffB8E',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '21002754684',
                  estimate: '197312',
                  limit: '256506',
                  amount: '4144095532209408',
                  amountUSD: '12.26',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 1,
                    symbol: 'ETH',
                    decimals: 18,
                    name: 'ETH',
                    coinKey: 'ETH',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                    priceUSD: '2958.61',
                  },
                },
              ],
            },
            tool: 'enso',
            toolDetails: {
              key: 'enso',
              name: 'Enso',
              logoURI: 'https://www.enso.finance/favicon.ico',
            },
          },
        ],
        transactionRequest: {
          data: `0x878863a4c7155db8084f763d1c67640cab806da1ee252085d2d12e70922126a3a8fadd8800000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}00000000000000000000000000000000000000000000021e5f445b3cf733ffb0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000086c6966692d617069000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a3078303030303030303030303030303030303030303030303030303030303030303030303030303030300000000000000000000000000000000000000000000000000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000022d21dbf3bee969a7b200000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000002a4b35d7e7300000000000000000000000083f20f44975d03b1b09e64809b757c47f942beea00000000000000000000000000000000000000000000022d21dbf3bee969a7b2000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000003ba08765201000102ffffff0283f20f44975d03b1b09e64809b757c47f942beea6e7a43a3010203ffffffff027e7d64d987cab6eed08a191c4c2459daf2f8ed0b241c59120102ffffffffffff7e7d64d987cab6eed08a191c4c2459daf2f8ed0b0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000022d21dbf3bee969a7b200000000000000000000000000000000000000000000000000000000000000200000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae00000000000000000000000000000000000000000000000000000000000000200000000000000000000000007d585b0e27bbb3d981b7757115ec11f47c476994000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000021e5f445b3cf733ffb000000000000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x4e3dc9a7c',
          gasLimit: '0x8bbf6',
          from: receiver,
          chainId: 1,
        },
      }
    },
  },
  '100-xdai-to-sdai': {
    // curl 'https://li.quest/v1/quote?fromChain=100&toChain=100&fromAddress=0x${receiver.slice(2).toLowerCase()}&fromToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&fromAmount=100000000000000000000&toToken=0xaf204776c7245bF4147c2612BF6e5972Ee483701&integrator=spark_fee&fee=0.002&slippage=0.001'
    block: 33975724n,
    endpoint: 'https://li.quest/v1/quote',
    method: 'GET',
    response(receiver) {
      return {
        type: 'lifi',
        id: '229d0d78-36e2-4a3d-ad9f-a176906e4111',
        tool: 'enso',
        toolDetails: {
          key: 'enso',
          name: 'Enso',
          logoURI: 'https://www.enso.finance/favicon.ico',
        },
        action: {
          fromToken: {
            address: '0x0000000000000000000000000000000000000000',
            chainId: 100,
            symbol: 'xDAI',
            decimals: 18,
            name: 'xDAI Native Token',
            coinKey: 'DAI',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '0.99975',
          },
          fromAmount: '100000000000000000000',
          toToken: {
            address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
            chainId: 100,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings xDAI',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
            priceUSD: '1.0772705854665527',
          },
          fromChainId: 100,
          toChainId: 100,
          slippage: 0.001,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: 'enso',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '92531277587273984626',
          toAmount: '92623901488762747373',
          fromAmount: '100000000000000000000',
          feeCosts: [
            {
              name: 'LIFI Fixed Fee',
              description: 'Fixed LIFI fee, independent of any other fee',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
              amount: '200000000000000000',
              amountUSD: '0.20',
              percentage: '0.0020',
              included: true,
            },
          ],
          gasCosts: [
            {
              type: 'SEND',
              price: '2260000000',
              estimate: '594800',
              limit: '773240',
              amount: '1344248000000000',
              amountUSD: '0.01',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '99.98',
          toAmountUSD: '99.78',
        },
        includedSteps: [
          {
            id: '54244c5d-81f0-4efa-a006-98a6c6193fd9',
            type: 'protocol',
            action: {
              fromChainId: 100,
              fromAmount: '100000000000000000000',
              fromToken: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
              toChainId: 100,
              toToken: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              fromAmount: '100000000000000000000',
              toAmount: '99800000000000000000',
              toAmountMin: '99800000000000000000',
              tool: 'feeCollection',
              approvalAddress: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9',
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2260000000',
                  estimate: '100000',
                  limit: '130000',
                  amount: '226000000000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
              feeCosts: [
                {
                  name: 'LIFI Fixed Fee',
                  description: 'Fixed LIFI fee, independent of any other fee',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                  amount: '200000000000000000',
                  amountUSD: '0.20',
                  percentage: '0.0020',
                  included: true,
                },
              ],
              executionDuration: 0,
            },
            tool: 'feeCollection',
            toolDetails: {
              key: 'feeCollection',
              name: 'Integrator Fee',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/feeCollection.png',
            },
          },
          {
            id: 'bf73c8f1-6f9a-42d7-a17c-9e9d6a365e1d',
            type: 'swap',
            action: {
              fromChainId: 100,
              fromAmount: '99800000000000000000',
              fromToken: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
              toChainId: 100,
              toToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0772705854665527',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: 'enso',
              fromAmount: '99800000000000000000',
              toAmount: '92623901488762747373',
              toAmountMin: '92531277587273984626',
              approvalAddress: '0x80EbA3855878739F4710233A8a19d89Bdd2ffB8E',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2260000000',
                  estimate: '151800',
                  limit: '197340',
                  amount: '343068000000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
            },
            tool: 'enso',
            toolDetails: {
              key: 'enso',
              name: 'Enso',
              logoURI: 'https://www.enso.finance/favicon.ico',
            },
          },
        ],
        integrator: 'spark_fee',
        transactionRequest: {
          data: `0x4630a0d82fa69447aa021ded69903e1ae754d5a34a77f0739482c3a36fcc7cb29a9e78a700000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}000000000000000000000000000000000000000000000005042122b6c287aa7200000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000009737061726b5f6665650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064e0cbc5f2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed70000000000000000000000000000000000000000000000000000000000000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837010000000000000000000000000000000000000000000000056900d33ca7fc000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e4b35d7e73000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000056900d33ca7fc0000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000005d0e30db00300ffffffffffffe91d153e0b41518a2ce8dd3d7944fa863463a97d095ea7b3010100ffffffffffe91d153e0b41518a2ce8dd3d7944fa863463a97d6e553f65010002ffffffff02af204776c7245bf4147c2612bf6e5972ee4837016e7a43a3010203ffffffff027e7d64d987cab6eed08a191c4c2459daf2f8ed0b241c59120102ffffffffffff7e7d64d987cab6eed08a191c4c2459daf2f8ed0b0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000056900d33ca7fc00000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000af204776c7245bf4147c2612bf6e5972ee48370100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000005042122b6c287aa7100000000000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x56bc75e2d63100000',
          gasPrice: '0x86b4dd00',
          gasLimit: '0xbcc78',
          from: receiver,
          chainId: 100,
        },
      }
    },
  },
  '100-usdc-to-sdai-on-gnosis': {
    // curl 'https://li.quest/v1/quote?fromChain=100&toChain=100&fromAddress=0x${receiver.slice(2).toLowerCase()}&fromToken=0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83&fromAmount=100000000&toToken=0xaf204776c7245bF4147c2612BF6e5972Ee483701&integrator=spark_fee&fee=0.002&slippage=0.001'
    block: 33975851n,
    endpoint: 'https://li.quest/v1/quote',
    method: 'GET',
    response(receiver) {
      return {
        type: 'lifi',
        id: 'c73e9f7f-a14f-4cfd-9761-1fa6df929d01',
        tool: '1inch',
        toolDetails: {
          key: '1inch',
          name: '1inch',
          logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.png',
        },
        action: {
          fromToken: {
            address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
            chainId: 100,
            symbol: 'USDC',
            decimals: 6,
            name: 'USD Coin',
            coinKey: 'USDC',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            priceUSD: '1',
          },
          fromAmount: '100000000',
          toToken: {
            address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
            chainId: 100,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings xDAI',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
            priceUSD: '1.0772705854665527',
          },
          fromChainId: 100,
          toChainId: 100,
          slippage: 0.001,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: '1inch',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '92510846603532071627',
          toAmount: '92603450053585657284',
          fromAmount: '100000000',
          feeCosts: [
            {
              name: 'LIFI Fixed Fee',
              description: 'Fixed LIFI fee, independent of any other fee',
              token: {
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                chainId: 100,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              amount: '200000',
              amountUSD: '0.20',
              percentage: '0.0020',
              included: true,
            },
          ],
          gasCosts: [
            {
              type: 'SEND',
              price: '2240000000',
              estimate: '473000',
              limit: '614900',
              amount: '1059520000000000',
              amountUSD: '0.01',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '100.00',
          toAmountUSD: '99.76',
        },
        includedSteps: [
          {
            id: 'b36018b7-5f27-4a48-97f8-bfa8343a4f65',
            type: 'protocol',
            action: {
              fromChainId: 100,
              fromAmount: '100000000',
              fromToken: {
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                chainId: 100,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              toChainId: 100,
              toToken: {
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                chainId: 100,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              fromAmount: '100000000',
              toAmount: '99800000',
              toAmountMin: '99800000',
              tool: 'feeCollection',
              approvalAddress: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9',
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2240000000',
                  estimate: '130000',
                  limit: '169000',
                  amount: '291200000000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
              feeCosts: [
                {
                  name: 'LIFI Fixed Fee',
                  description: 'Fixed LIFI fee, independent of any other fee',
                  token: {
                    address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                    chainId: 100,
                    symbol: 'USDC',
                    decimals: 6,
                    name: 'USD Coin',
                    coinKey: 'USDC',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                    priceUSD: '1',
                  },
                  amount: '200000',
                  amountUSD: '0.20',
                  percentage: '0.0020',
                  included: true,
                },
              ],
              executionDuration: 0,
            },
            tool: 'feeCollection',
            toolDetails: {
              key: 'feeCollection',
              name: 'Integrator Fee',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/feeCollection.png',
            },
          },
          {
            id: '1fcf8e2b-6301-42c2-b9dd-719b51b59d92',
            type: 'swap',
            action: {
              fromChainId: 100,
              fromAmount: '99800000',
              fromToken: {
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                chainId: 100,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              toChainId: 100,
              toToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0772705854665527',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: '1inch',
              fromAmount: '99800000',
              toAmount: '92603450053585657284',
              toAmountMin: '92510846603532071627',
              approvalAddress: '0x1111111254eeb25477b68fb85ed929f73a960582',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2240000000',
                  estimate: '0',
                  limit: '0',
                  amount: '0',
                  amountUSD: '0.00',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
            },
            tool: '1inch',
            toolDetails: {
              key: '1inch',
              name: '1inch',
              logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.png',
            },
          },
        ],
        integrator: 'spark_fee',
        transactionRequest: {
          data: `0x4630a0d86bbc56ee6253df1ac5c3d81519f3e2248672015250fed6e6a64a9d1991cbd38b00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}00000000000000000000000000000000000000000000000503d88cd7aa2e72cb00000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000009737061726b5f6665650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a83000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a830000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000084eedd56e1000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a8300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed7000000000000000000000000000000000000000000000000000000000000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000001111111254eeb25477b68fb85ed929f73a960582000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a83000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837010000000000000000000000000000000000000000000000000000000005f2d3c000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026812aa3caf000000000000000000000000f5ab9bf279284fb8e3de1c3bf0b0b4a6fb0bb538000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a83000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000f5ab9bf279284fb8e3de1c3bf0b0b4a6fb0bb5380000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000005f2d3c000000000000000000000000000000000000000000000000503d88cd7aa2e72ca000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d90000000000000000000000000000000000000000000000000000000000bb00a0bd46a343822086f52651837600180de173b09470f54ef7491000000000000000000000004f7644fa5d0ea14fcf3e813fdf93ca9544f8567655000000000000000000000066000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a830000000000000000000000004ecaba5870353805a9f068101a40e0f32ed605c6000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837011111111254eeb25477b68fb85ed929f73a960582000000000000002a94d114000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x8583b000',
          gasLimit: '0x961f4',
          from: receiver,
          chainId: 100,
        },
      }
    },
  },
  'sdai-to-100-xdai': {
    // curl 'https://li.quest/v1/quote/contractCalls' \
    //   -H 'content-type: application/json' \
    //   --data-raw '{"fromChain":"100","toChain":"100","fromAddress":"0x${receiver.slice(2).toLowerCase()}","fromToken":"0xaf204776c7245bF4147c2612BF6e5972Ee483701","toToken":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","toAmount":"100000000000000000000","integrator":"spark_fee","fee":"0.002","slippage":"0.001","contractCalls":[]}'
    block: 33976095n,
    endpoint: 'https://li.quest/v1/quote/contractCalls',
    method: 'POST',
    response(receiver) {
      return {
        type: 'lifi',
        id: '8c8d14bf-7dc2-431a-bcce-2403b277a41c',
        tool: 'enso',
        toolDetails: {
          key: 'enso',
          name: 'Enso',
          logoURI: 'https://www.enso.finance/favicon.ico',
        },
        action: {
          fromToken: {
            address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
            chainId: 100,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings xDAI',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
            priceUSD: '1.07720504130442',
          },
          fromAmount: '93135144453157870649',
          toToken: {
            address: '0x0000000000000000000000000000000000000000',
            chainId: 100,
            symbol: 'xDAI',
            decimals: 18,
            name: 'xDAI Native Token',
            coinKey: 'DAI',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '0.99975',
          },
          fromChainId: 100,
          toChainId: 100,
          slippage: 0.001,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: 'enso',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '100049999999999999999',
          toAmount: '100150150150150150149',
          fromAmount: '93135144453157870649',
          feeCosts: [
            {
              name: 'LIFI Fixed Fee',
              description: 'Fixed LIFI fee, independent of any other fee',
              token: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.07720504130442',
              },
              amount: '186270288906315741',
              amountUSD: '0.20',
              percentage: '0.0020',
              included: true,
            },
          ],
          gasCosts: [
            {
              type: 'SEND',
              price: '2270000000',
              estimate: '599812',
              limit: '779756',
              amount: '1361573240000000',
              amountUSD: '0.01',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '100.33',
          toAmountUSD: '100.13',
        },
        includedSteps: [
          {
            id: 'bc2cc10c-ffe9-4a9b-a77a-342030b06985',
            type: 'protocol',
            action: {
              fromChainId: 100,
              fromAmount: '93135144453157870649',
              fromToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.07720504130442',
              },
              toChainId: 100,
              toToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.07720504130442',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              fromAmount: '93135144453157870649',
              toAmount: '92948874164251554908',
              toAmountMin: '92948874164251554908',
              tool: 'feeCollection',
              approvalAddress: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9',
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2270000000',
                  estimate: '130000',
                  limit: '169000',
                  amount: '295100000000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
              feeCosts: [
                {
                  name: 'LIFI Fixed Fee',
                  description: 'Fixed LIFI fee, independent of any other fee',
                  token: {
                    address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                    chainId: 100,
                    symbol: 'sDAI',
                    decimals: 18,
                    name: 'Savings xDAI',
                    coinKey: 'sDAI',
                    logoURI:
                      'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                    priceUSD: '1.07720504130442',
                  },
                  amount: '186270288906315741',
                  amountUSD: '0.20',
                  percentage: '0.0020',
                  included: true,
                },
              ],
              executionDuration: 0,
            },
            tool: 'feeCollection',
            toolDetails: {
              key: 'feeCollection',
              name: 'Integrator Fee',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/feeCollection.png',
            },
          },
          {
            id: '779feef0-ca74-45b6-943f-cf9dd919b4d4',
            type: 'swap',
            action: {
              fromChainId: 100,
              fromAmount: '92948874164251554908',
              fromToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.07720504130442',
              },
              toChainId: 100,
              toToken: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99975',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: 'enso',
              fromAmount: '92948874164251554908',
              toAmount: '100150150150150150149',
              toAmountMin: '100049999999999999999',
              approvalAddress: '0x80EbA3855878739F4710233A8a19d89Bdd2ffB8E',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '2270000000',
                  estimate: '126812',
                  limit: '164856',
                  amount: '287863240000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99975',
                  },
                },
              ],
            },
            tool: 'enso',
            toolDetails: {
              key: 'enso',
              name: 'Enso',
              logoURI: 'https://www.enso.finance/favicon.ico',
            },
          },
        ],
        integrator: 'spark_fee',
        transactionRequest: {
          data: `0x4630a0d81ad97638f84d94edaa9489cdbedf9b016175942127eeeda11bde37dc40c7369800000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}0000000000000000000000000000000000000000000000056c7900e991d4ffff00000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000009737061726b5f6665650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837010000000000000000000000000000000000000000000000050c82806dd32adc3900000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000084eedd56e1000000000000000000000000af204776c7245bf4147c2612bf6e5972ee48370100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000295c3d7427867dd00000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed70000000000000000000000000000000000000000000000000000000000000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000509ecbc9690b2745c00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c4b35d7e73000000000000000000000000af204776c7245bf4147c2612bf6e5972ee48370100000000000000000000000000000000000000000000000509ecbc9690b2745c000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000005ba08765201000101ffffff01af204776c7245bf4147c2612bf6e5972ee4837012e1a7d4d0101ffffffffffffe91d153e0b41518a2ce8dd3d7944fa863463a97d19198595a30182ffffffffff1231deb6f5749ef6ce6943a275a1d3e7486f4eae6e7a43a3010103ffffffff017e7d64d987cab6eed08a191c4c2459daf2f8ed0b241c59120101ffffffffffff7e7d64d987cab6eed08a191c4c2459daf2f8ed0b0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000509ecbc9690b2745c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000007d585b0e27bbb3d981b7757115ec11f47c476994000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000056c7900e991d4fffe00000000000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x874d7380',
          gasLimit: '0xbe5ec',
          from: receiver,
          chainId: 100,
        },
      }
    },
  },
  'sdai-to-100-usdc-on-gnosis': {
    // curl 'https://li.quest/v1/quote/contractCalls' \
    //   -H 'content-type: application/json' \
    //   --data-raw '{"fromChain":"100","toChain":"100","fromAddress":"0x${receiver.slice(2).toLowerCase()}","fromToken":"0xaf204776c7245bF4147c2612BF6e5972Ee483701","toToken":"0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83","toAmount":"100000000","integrator":"spark_fee","fee":"0.002","slippage":"0.001","contractCalls":[]}'
    block: 33988883n,
    endpoint: 'https://li.quest/v1/quote/contractCalls',
    method: 'POST',
    response(receiver) {
      return {
        type: 'lifi',
        id: '267ef4a7-023d-4ff2-98ff-032fb1e4d211',
        tool: 'enso',
        toolDetails: {
          key: 'enso',
          name: 'Enso',
          logoURI: 'https://www.enso.finance/favicon.ico',
        },
        action: {
          fromToken: {
            address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
            chainId: 100,
            symbol: 'sDAI',
            decimals: 18,
            name: 'Savings xDAI',
            coinKey: 'sDAI',
            logoURI:
              'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
            priceUSD: '1.0770827108399679',
          },
          fromAmount: '93111748509835469317',
          toToken: {
            address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
            chainId: 100,
            symbol: 'USDC',
            decimals: 6,
            name: 'USD Coin',
            coinKey: 'USDC',
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            priceUSD: '1',
          },
          fromChainId: 100,
          toChainId: 100,
          slippage: 0.001,
          fromAddress: receiver,
          toAddress: receiver,
        },
        estimate: {
          tool: 'enso',
          approvalAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          toAmountMin: '100049999',
          toAmount: '100150149',
          fromAmount: '93111748509835469317',
          feeCosts: [
            {
              name: 'LIFI Fixed Fee',
              description: 'Fixed LIFI fee, independent of any other fee',
              token: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0770827108399679',
              },
              amount: '186223497019670938',
              amountUSD: '0.20',
              percentage: '0.0020',
              included: true,
            },
          ],
          gasCosts: [
            {
              type: 'SEND',
              price: '1610000000',
              estimate: '900008',
              limit: '1170010',
              amount: '1449012880000000',
              amountUSD: '0.01',
              token: {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 100,
                symbol: 'xDAI',
                decimals: 18,
                name: 'xDAI Native Token',
                coinKey: 'DAI',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                priceUSD: '0.99945',
              },
            },
          ],
          executionDuration: 30,
          fromAmountUSD: '100.29',
          toAmountUSD: '100.15',
        },
        includedSteps: [
          {
            id: '80651eec-5e1b-4b7a-a677-ceb9416be1ea',
            type: 'protocol',
            action: {
              fromChainId: 100,
              fromAmount: '93111748509835469317',
              fromToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0770827108399679',
              },
              toChainId: 100,
              toToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0770827108399679',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              fromAmount: '93111748509835469317',
              toAmount: '92925525012815798379',
              toAmountMin: '92925525012815798379',
              tool: 'feeCollection',
              approvalAddress: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9',
              gasCosts: [
                {
                  type: 'SEND',
                  price: '1610000000',
                  estimate: '130000',
                  limit: '169000',
                  amount: '209300000000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99945',
                  },
                },
              ],
              feeCosts: [
                {
                  name: 'LIFI Fixed Fee',
                  description: 'Fixed LIFI fee, independent of any other fee',
                  token: {
                    address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                    chainId: 100,
                    symbol: 'sDAI',
                    decimals: 18,
                    name: 'Savings xDAI',
                    coinKey: 'sDAI',
                    logoURI:
                      'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                    priceUSD: '1.0770827108399679',
                  },
                  amount: '186223497019670938',
                  amountUSD: '0.20',
                  percentage: '0.0020',
                  included: true,
                },
              ],
              executionDuration: 0,
            },
            tool: 'feeCollection',
            toolDetails: {
              key: 'feeCollection',
              name: 'Integrator Fee',
              logoURI:
                'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/feeCollection.png',
            },
          },
          {
            id: '787e4cdc-b4bd-449c-a1f1-25162f4deb09',
            type: 'swap',
            action: {
              fromChainId: 100,
              fromAmount: '92925525012815798379',
              fromToken: {
                address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
                chainId: 100,
                symbol: 'sDAI',
                decimals: 18,
                name: 'Savings xDAI',
                coinKey: 'sDAI',
                logoURI:
                  'https://static.debank.com/image/xdai_token/logo_url/0xaf204776c7245bf4147c2612bf6e5972ee483701/8230d73bf3b22b0b095a61c79f1815cb.png',
                priceUSD: '1.0770827108399679',
              },
              toChainId: 100,
              toToken: {
                address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
                chainId: 100,
                symbol: 'USDC',
                decimals: 6,
                name: 'USD Coin',
                coinKey: 'USDC',
                logoURI:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                priceUSD: '1',
              },
              slippage: 0.001,
              fromAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              toAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            },
            estimate: {
              tool: 'enso',
              fromAmount: '92925525012815798379',
              toAmount: '100150149',
              toAmountMin: '100049999',
              approvalAddress: '0x80EbA3855878739F4710233A8a19d89Bdd2ffB8E',
              executionDuration: 30,
              feeCosts: [],
              gasCosts: [
                {
                  type: 'SEND',
                  price: '1610000000',
                  estimate: '427008',
                  limit: '555110',
                  amount: '687482880000000',
                  amountUSD: '0.01',
                  token: {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 100,
                    symbol: 'xDAI',
                    decimals: 18,
                    name: 'xDAI Native Token',
                    coinKey: 'DAI',
                    logoURI:
                      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
                    priceUSD: '0.99945',
                  },
                },
              ],
            },
            tool: 'enso',
            toolDetails: {
              key: 'enso',
              name: 'Enso',
              logoURI: 'https://www.enso.finance/favicon.ico',
            },
          },
        ],
        integrator: 'spark_fee',
        transactionRequest: {
          data: `0x4630a0d8152ce0069954588d37bfe2fd13cf898bf23da3d160e17330cb33d6a21f45dbb900000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000${receiver.slice(2).toLowerCase()}0000000000000000000000000000000000000000000000000000000005f6a44f00000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000009737061726b5f6665650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307830303030303030303030303030303030303030303030303030303030303030303030303030303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000bd6c7b0d2f68c2b7805d88388319cfb6ecb50ea9000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837010000000000000000000000000000000000000000000000050c2f61f14840220500000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000084eedd56e1000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002959948acb0419a00000000000000000000000029dacdf7ccadf4ee67c923b4c22255a4b2494ed70000000000000000000000000000000000000000000000000000000000000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e00000000000000000000000080eba3855878739f4710233a8a19d89bdd2ffb8e000000000000000000000000af204776c7245bf4147c2612bf6e5972ee483701000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a830000000000000000000000000000000000000000000000050999c8a89b8fe06b00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e4b35d7e73000000000000000000000000af204776c7245bf4147c2612bf6e5972ee4837010000000000000000000000000000000000000000000000050999c8a89b8fe06b000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000008ba08765201000101ffffff01af204776c7245bf4147c2612bf6e5972ee4837012e1a7d4d0101ffffffffffffe91d153e0b41518a2ce8dd3d7944fa863463a97d83d1eb8443000000000000819857a929f9317c593739968f00117204f536dfd60102030401058687ffffffffffffffffffffffffffffffffffffffffffffffff9bd3b227018108ffffffff016675a323dedb77822fcf39eaa9d682f6abe72555ddcd52200101ffffffffff017e7d64d987cab6eed08a191c4c2459daf2f8ed0b6e7a43a3010109ffffffff017e7d64d987cab6eed08a191c4c2459daf2f8ed0b241c59120101ffffffffffff7e7d64d987cab6eed08a191c4c2459daf2f8ed0b000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000005a000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000050999c8a89b8fe06b00000000000000000000000000000000000000000000000000000000000000200000000000000000000000007d585b0e27bbb3d981b7757115ec11f47c4769940000000000000000000000000000000000000000000000000000000000000020000000000000000000000000111111125421ca6dc452d289314280a0f8842a650000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a8300000000000000000000000000000000000000000000000000000000000000200000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000022807ed2379000000000000000000000000f5ab9bf279284fb8e3de1c3bf0b0b4a6fb0bb538000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000ddafbb505ad214d7b80b1f830fccc89b60fb7a83000000000000000000000000f5ab9bf279284fb8e3de1c3bf0b0b4a6fb0bb5380000000000000000000000009857a929f9317c593739968f00117204f536dfd60000000000000000000000000000000000000000000000056bf9b47afdafa29a0000000000000000000000000000000000000000000000000000000002fb31c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000c90000000000000000000000000000000000000000000000ab00007d00001a4041e91d153e0b41518a2ce8dd3d7944fa863463a97dd0e30db000a0fbb7cd06802086f52651837600180de173b09470f54ef7491000000000000000000000004fe91d153e0b41518a2ce8dd3d7944fa863463a97dddafbb505ad214d7b80b1f830fccc89b60fb7a83111111125421ca6dc452d289314280a0f8842a650020d6bdbf78ddafbb505ad214d7b80b1f830fccc89b60fb7a83111111125421ca6dc452d289314280a0f8842a65000000000000000000000000000000000000000000000097864b910000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000005f6a44e00000000000000000000000000000000000000000000000000000000`,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0x5ff6a680',
          gasLimit: '0x11da5a',
          from: receiver,
          chainId: 100,
        },
      }
    },
  },
} satisfies Record<string, LifiResponse>

interface LifiResponse {
  block: bigint
  endpoint: string | ((url: URL) => boolean)
  method: 'GET' | 'POST'
  response: (receiver: Address, slippage: number) => Object
}

export async function blockLifiApiCalls(page: Page): Promise<void> {
  // only whitelisted calls with overrideLiFiRoute will be allowed
  await page.route(/li.quest/, (route) => route.abort())
}
