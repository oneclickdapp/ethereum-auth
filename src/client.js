import gql from "graphql-tag";

import { unlockBrowser } from "./browser";
import { unlockWalletConnect, disconnectWalletConnect } from "./walletConnect";
import { getErrorResponse, signMessage } from "./utils";

import { LOCAL_TOKEN_KEY, WALLET_TYPES } from "./constants";

const AUTH_CHALLENGE_MUTATION = gql`
  mutation AuthChallengeMutation($input: AuthChallengeInput!) {
    authChallenge(input: $input) {
      message
    }
  }
`;
const AUTH_VERIFY_MUTATION = gql`
  mutation AuthVerifyMutation($input: AuthVerifyInput!) {
    authVerify(input: $input) {
      token
    }
  }
`;

// TODO: Add types to package, and enable typescript
// export type Ethereum = InstanceType<typeof EthereumAuthClient>;

class EthereumAuthClient {
  constructor({
    makeRequest,
    rpc,
    infuraId,
    debug,
    onNetworkChange,
    onDisconnect
  }) {
    if (!makeRequest)
      throw new Error(
        'You must provide "makeRequest" to instantiate EthereumAuthClient'
      );
    this.makeRequest = makeRequest;
    this.debug = debug;
    this.rpc = rpc;
    this.infuraId = infuraId;
    this.onNetworkChange = onNetworkChange;
    this.onDisconnect = onDisconnect;
  }

  async login(type = WALLET_TYPES.browser) {
    try {
      const isWalletConnect = type === WALLET_TYPES.walletConnect;
      let unlock = unlockBrowser;
      if (isWalletConnect) {
        if (!this.rpc && !this.infuraId)
          throw Error(
            "You must provide either an rpc or infuraId to use Wallet Connect"
          );
        unlock = unlockWalletConnect;
      }
      const {
        walletAddress,
        walletProvider,
        error: unlockError,
        hasWallet
      } = await unlock({
        debug: this.debug,
        infuraId: this.infuraId,
        rpc: this.rpc,
        onDisconnect: this.onDisconnect,
        onNetworkChange: this.onNetworkChange
      });

      if (unlockError) {
        // TODO Show unlock toast message
        console.log(unlockError);
        throw Error("We had trouble unlocking your wallet");
      }
      if (!hasWallet) throw Error("No Web3 wallet present in the browser");

      let message;
      try {
        ({
          data: {
            authChallenge: { message }
          }
        } = await this.makeRequest(AUTH_CHALLENGE_MUTATION, {
          input: { address: walletAddress }
        }));
      } catch (e) {
        console.log(e);
        throw Error("Couldn't get auth challenge from your server");
      }

      const { signature, error: signError } = await signMessage({
        walletProvider,
        message,
        isWalletConnect
      });

      if (signError) {
        console.log(signError);
        throw Error("Failed to get signature from user");
      }

      let token;
      try {
        ({
          data: {
            authVerify: { token }
          }
        } = await this.makeRequest(AUTH_VERIFY_MUTATION, {
          input: { address: walletAddress, signature }
        }));
      } catch (e) {
        console.log(e);
        throw Error("Authentication failed");
      }
      localStorage.setItem(LOCAL_TOKEN_KEY, token);
    } catch (e) {
      console.log(
        getErrorResponse(`${e}. See above error for more details.`, "login")
          .error.message
      );
    }
  }

  logout() {
    if (this.type === WALLET_TYPES.walletConnect) disconnectWalletConnect();
    return localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }

  getUserMetadata() {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }
}

export default EthereumAuthClient;
