export type RpcResponse = string | object

// handles given rpc call or return undefined if not handled
export type RpcHandler = (method: string, params: any) => RpcResponse | Promise<RpcResponse> | undefined
