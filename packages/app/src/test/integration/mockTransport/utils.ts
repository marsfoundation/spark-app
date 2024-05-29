export function normalizeNumber(value: bigint | number): bigint {
  if (typeof value === 'bigint') {
    return value
  }
  return BigInt(value)
}

export function encodeRpcQuantity(value: bigint | number): string {
  return `0x${normalizeNumber(value).toString(16)}`
}

export function encodeRpcUnformattedData(value: string): string {
  if (!value.startsWith('0x')) {
    throw new Error('Unformatted data must start with 0x')
  }
  if (value.length % 2 !== 0) {
    throw new Error('Unformatted data must have even length')
  }
  return value
}

// removes undefined values from object to make comparison easier
export function cleanObject(obj: any): any {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getEmptyTxData() {
  return {
    blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    blockNumber: '0x1',
    from: '0x0000000000000000000000000000000000000000',
    gas: '0x1',
    gasPrice: '0x1',
    hash: '0x1',
    input: '0x',
    nonce: '0x1',
    to: '0x0000000000000000000000000000000000000000',
    transactionIndex: '0x1',
    value: '0x0',
    v: '0x0',
    r: '0x0000000000000000000000000000000000000000000000000000000000000000',
    s: '0x0000000000000000000000000000000000000000000000000000000000000000',
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getEmptyTxReceipt() {
  return {
    blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    blockNumber: '0x1',
    contractAddress: null,
    cumulativeGasUsed: '0x1',
    effectiveGasPrice: '0x1',
    gasUsed: '0x1',
    from: '0x0000000000000000000000000000000000000000',
    logs: [{}],
    logsBloom: '0x0000000000000000000000000000000000000000000000000000000000000000',
    status: '0x1',
    to: '0x0000000000000000000000000000000000000000',
    transactionHash: '0x01',
    transactionIndex: '0x1',
    type: '0x2',
  }
}
