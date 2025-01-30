import { Client } from 'viem'

// believe it or not but this seems to be the best way to create a type that accepts any client
// otherwise running into issues with TestnetClient is very easy
export type AnyViemClient = Client<any, any, any, any, any>
