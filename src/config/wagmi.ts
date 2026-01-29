import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

const walletConnectProjectId = process.env.BUN_ENV_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error("Missing BUN_ENV_WALLETCONNECT_PROJECT_ID environment variable");
}

export const config = getDefaultConfig({
  appName: 'Blockchain Chat',
  projectId: walletConnectProjectId,
  chains: [baseSepolia],
  ssr: false, // Since this is a client-side app
});
