import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const walletConnectProjectId = process.env.PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error("Missing PUBLIC_WALLETCONNECT_PROJECT_ID environment variable");
}

const alchemyApiKey = process.env.PUBLIC_ALCHEMY_API_KEY;

if (!alchemyApiKey) {
  throw new Error("Missing PUBLIC_ALCHEMY_API_KEY environment variable");
}

export const config = getDefaultConfig({
  appName: 'Blockchain Chat',
  projectId: walletConnectProjectId,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },
  ssr: false,
});
