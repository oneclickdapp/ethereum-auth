export const getErrorResponse = (error, functionName) => {
  const errorText = typeof error === "string" ? error : error.message;
  const res = {
    /* eslint-disable-nextline i18next/no-literal-string */
    message: `Error ethereum-auth.${functionName}(): ${errorText}`
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

export const signMessage = async ({ walletProvider, message }) => {
  try {
    const signature = await walletProvider.getSigner(0).signMessage(message);
    return { signature };
  } catch (error) {
    return getErrorResponse(error, "signMessage");
  }
};
