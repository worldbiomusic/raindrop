import 'dotenv/config';
import { createWalletClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL)
})

export const adminAccount = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY)

