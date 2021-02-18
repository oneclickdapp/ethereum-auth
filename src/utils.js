import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { arrayify } from "@ethersproject/bytes";

export const getErrorResponse = (error, functionName) => {
  const errorText = typeof error === "string" ? error : error.message;
  const res = {
    /* eslint-disable-nextline i18next/no-literal-string */
    message: `Error @oneclickdapp/ethereum-auth ${functionName}(): ${errorText}`
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

const preparePayloadForSigning = rawMessage => {
  const rawMessageLength = new Blob([rawMessage]).size;
  const message = toUtf8Bytes(
    "\x19Ethereum Signed Message:\n" + rawMessageLength + rawMessage
  );
  return arrayify(keccak256(message));
};

export const signMessage = async ({
  walletProvider,
  message,
  isWalletConnect
}) => {
  try {
    if (isWalletConnect) message = preparePayloadForSigning(message);
    const signature = await walletProvider.getSigner(0).signMessage(message);
    return { signature };
  } catch (error) {
    return getErrorResponse(error, "signMessage");
  }
};
