export interface ITestForkService {
  createFork: (args: CreateForkArgs) => Promise<string>
  deleteFork: (forkUrl: string) => Promise<void>
}

export interface CreateForkArgs {
  originChainId: number
  forkChainId: number
  blockNumber: bigint
}
