import Web3Utils from "../src";

let web3utils;

describe.skip("Tests user initialization", () => {
  it("should successfully create a new user", () => {
    web3utils = new Web3Utils();
    const user = web3utils.user();
    expect(user).toBeInstanceOf(Object);
  });
});
