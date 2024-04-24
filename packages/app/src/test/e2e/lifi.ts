import { Page } from '@playwright/test'
import assert from 'assert'
import { Address } from 'viem'

export async function overrideLiFiRoute(
  page: Page,
  receiver: Address,
  preset: keyof typeof lifiResponses,
  expectedBlockNumber: bigint,
): Promise<void> {
  const presetValue = lifiResponses[preset]

  assert(
    presetValue.block === expectedBlockNumber,
    `preset ${preset}(${presetValue.block}) is not available at block ${expectedBlockNumber}`,
  )

  await page.route(presetValue.endpoint, async (route) => {
    await route.fulfill({
      json: presetValue.response(receiver),
    })
  })
}

const lifiResponses = {
  '100-dai-to-sdai': {
    // curl --request GET \
    //  --url 'https://li.quest/v1/quote?fromChain=1&toChain=1&fromToken=0x6B175474E89094C44Da98b954EedeAC495271d0F&toToken=0x83f20f44975d03b1b09e64809b757c47f942beea&fromAddress=0x68F6148E28Ded21f92bBA55Ab1d2b39DBa0726b2&fromAmount=100000000000000000000' \
    //  --header 'accept: application/json'
    block: 19519583n,
    endpoint: 'https://li.quest/v1/quote?*',
    response: (receiver: Address) => ({
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
        slippage: 0.005,
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
            slippage: 0.005,
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
    endpoint: 'https://li.quest/v1/quote?*',
    response: (receiver: Address) => ({
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
        slippage: 0.005,
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
            slippage: 0.005,
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
    response: (receiver: Address) => ({
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
        slippage: 0.005,
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
            slippage: 0.005,
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
    response: (receiver: Address) => ({
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
        slippage: 0.005,
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
            slippage: 0.005,
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
    endpoint: 'https://li.quest/v1/quote?*',
    block: 19609252n,
    response(receiver) {
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
          slippage: 0.005,
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
              slippage: 0.005,
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
    endpoint: 'https://li.quest/v1/quote?*',
    block: 19609941n,
    response(receiver) {
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
          slippage: 0.005,
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
              slippage: 0.005,
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
} satisfies Record<string, LifiResponse>

interface LifiResponse {
  block: bigint
  endpoint: string
  response: (receiver: Address) => Object
}

export async function blockLifiApiCalls(page: Page): Promise<void> {
  // only whitelisted calls with overrideLiFiRoute will be allowed
  await page.route(/li.quest/, (route) => route.abort())
}
