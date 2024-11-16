import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  mainnet,
  sepolia,
  hardhat,
  baseSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID}`,
  chains: [
    mainnet,
    hardhat,
    base,
    baseSepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});