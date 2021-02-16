import { Web3Provider } from "@ethersproject/providers";
import gql from "graphql-tag";

import { unlockBrowser } from "./browser";
import { unlockWalletConnect } from "./walletConnect";
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
  constructor({ makeRequest, type = WALLET_TYPES.browser, rpc, debug }) {
    if (!makeRequest)
      throw new Error(
        'You must provide "makeRequest" to instantiate EthereumAuthClient'
      );
    this.makeRequest = makeRequest;
    this.debug = debug;
    this.type = type;
    this.rpc = rpc;
  }

  async login() {
    let unlock = unlockBrowser;
    if (this.type === WALLET_TYPES.walletConnect) unlock = unlockWalletConnect;
    const {
      walletAddress,
      walletProvider,
      error: unlockError,
      hasWallet
    } = await unlock({ debug: this.debug });

    if (unlockError) {
      if (this.debug) console.log(unlockError);
      return;
    }

    const {
      data: {
        authChallenge: { message }
      }
    } = await this.makeRequest(AUTH_CHALLENGE_MUTATION, {
      input: { address: walletAddress }
    });

    const { signature, error: signError } = await signMessage({
      walletProvider,
      message
    });

    if (signError) {
      if (this.debug) console.log(signError);
      return;
    }

    const {
      data: {
        authVerify: { token }
      }
    } = await this.makeRequest(AUTH_VERIFY_MUTATION, {
      input: { address: walletAddress, signature }
    });
    localStorage.setItem(LOCAL_TOKEN_KEY, token);
  }

  logout() {
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
