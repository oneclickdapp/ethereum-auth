import { Web3Provider } from "@ethersproject/providers";
import gql from "graphql-tag";

const LOCAL_TOKEN_KEY = "wallet_auth_token";

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
export const getErrorResponse = (error, functionName) => {
  const errorText = typeof error === "string" ? error : error.message;
  const res = {
    /* eslint-disable-nextline i18next/no-literal-string */
    message: `Error ethereumAuth.${functionName}(): ${errorText}`
  };
  const ABORTED = "aborted";
  const EXCEPTION = "exception";
  const UNKOWN = "unknown error type";
  if (error.code) {
    res.code = error.code;
    switch (error.code) {
      case 4001:
        res.txErrorType = ABORTED;
        break;
      case -32016:
        res.txErrorType = EXCEPTION;
        break;
      default:
        res.txErrorType = UNKOWN;
    }
  }
  return { error: res };
};

export const isWeb3EnabledBrowser = () =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const unlockBrowser = async ({ debug }) => {
  try {
    if (!isWeb3EnabledBrowser()) {
      return { hasWallet: false, isUnlocked: false };
    }
    window.ethereum.autoRefreshOnNetworkChange = false;

    const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });

    const walletProvider = new Web3Provider(window.ethereum);

    const network = await walletProvider.getNetwork();
    if (debug)
      /* eslint-disable-next-line no-console */
      console.log(
        "Web3Browser wallet loaded: ",
        JSON.stringify({ walletAddress, network })
      );
    return {
      hasWallet: true,
      walletAddress: walletAddress[0],
      walletProvider
    };
  } catch (error) {
    if (isWeb3EnabledBrowser()) {
      if (debug)
        /* eslint-disable-next-line no-console */
        console.log("Web3 detected in browser, but wallet unlock failed");
      return {
        hasWallet: true,
        isUnlocked: false,
        ...getErrorResponse(error, "unlockBrowser")
      };
    }
    return {
      hasWallet: false,
      isUnlocked: false,
      ...getErrorResponse(error, "unlockBrowser")
    };
  }
};

export const signMessage = async ({ walletProvider, message }) => {
  try {
    const signature = await walletProvider.getSigner(0).signMessage(message);
    return { signature };
  } catch (error) {
    return getErrorResponse(error, "signMessage");
  }
};

// TODO: Add types to package, and enable typescript
// export type Ethereum = InstanceType<typeof EthereumAuthClient>;

class EthereumAuthClient {
  constructor({ makeRequest, debug }) {
    if (!makeRequest)
      throw new Error(
        'You must provide "makeRequest" to instantiate EthereumAuthClient'
      );
    this.makeRequest = makeRequest;
    this.debug = debug;
  }

  async login() {
    const {
      walletAddress,
      walletProvider,
      error: unlockError,
      hasWallet
    } = await unlockBrowser({ debug: this.debug });

    if (unlockError) {
      if (this.debug) console.log(unlockError);
      return;
    }

    const {
      data: {
        authChallenge: { message }
      }
    } = await this.makeRequest({
      mutation: AUTH_CHALLENGE_MUTATION,
      variables: { input: { address: walletAddress } }
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
    } = await this.makeRequest({
      mutation: AUTH_VERIFY_MUTATION,
      variables: { input: { address: walletAddress, signature } }
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
