import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { getErrorResponse } from "./utils";
import { LOCAL_TOKEN_KEY } from "./constants";

export const disconnectWalletConnect = () => {
  localStorage.removeItem(WALLET_CONNECT_LOCAL_KEY);
};

export const unlockWalletConnect = async ({
  debug,
  infuraKey,
  onNetworkChange,
  onDisconnect
}) => {
  try {
    const provider = new WalletConnectProvider({
      infuraId: infuraKey // Required
    });
    provider.on("chainChanged", onNetworkChange);
    provider.on("close", () => onDisconnect());

    await provider.enable();
    const walletProvider = new Web3Provider(provider);
    const network = await walletProvider.getNetwork();
    const walletAddress = provider.accounts[0];
    if (debug)
      /* eslint-disable-next-line no-console */
      console.log(
        "WalletConnect wallet loaded: ",
        JSON.stringify({ walletAddress, network })
      );
    return {
      hasWallet: true,
      isUnlocked: true,
      walletType: WALLET_CONNECT_ID,
      walletAddress,
      network,
      walletProvider
    };
  } catch (error) {
    return {
      hasWallet: false,
      isUnlocked: false,
      ...getErrorResponse(error, "unlockWalletConnect")
    };
  }
};

export const checkClosedWalletConnect = async ({ debug, infuraKey }) => {
  try {
    await new WalletConnectProvider({
      infuraId: infuraKey
    });
    return localStorage.getItem(WALLET_CONNECT_LOCAL_KEY) !== "undefined";
  } catch (error) {
    /* eslint-disable-next-line no-console */
    if (debug) console.log("Issue during checkClosedWalletConnect():", error);
    return true;
  }
};
