import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID}`,
  chains: [
    baseSepolia
  ],
  ssr: true,
});