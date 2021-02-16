import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { getErrorResponse } from "./utils";
import { LOCAL_TOKEN_KEY } from "./constants";

export const disconnectWalletConnect = () => {
  localStorage.removeItem(WALLET_CONNECT_LOCAL_KEY);
};

export const unlockWalletConnect = async ({
  debug,
  infuraId,
  rpc,
  onNetworkChange,
  onDisconnect
}) => {
  try {
    const provider = new WalletConnectProvider({
      infuraId,
      rpc
    });
    // provider.on("chainChanged", onNetworkChange);
    provider.on("close", () => {
      disconnectWalletConnect();
      onDisconnect && onDisconnect();
    });

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

export const checkClosedWalletConnect = async ({ debug, infuraId }) => {
  try {
    await new WalletConnectProvider({
      infuraId: infuraId
    });
    return localStorage.getItem(WALLET_CONNECT_LOCAL_KEY) !== "undefined";
  } catch (error) {
    /* eslint-disable-next-line no-console */
    if (debug) console.log("Issue during checkClosedWalletConnect():", error);
    return true;
  }
};
