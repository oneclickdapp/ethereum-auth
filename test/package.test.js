import Web3Utils from "../src";

let web3utils;

describe.skip("Tests library initialization", () => {
  it("should successfully create a new library object", () => {
    web3utils = new Web3Utils();
    expect(web3utils).toBeInstanceOf(Object);
  });
  it("should successfully create a new library object with options", () => {
    const options = {
      debug: true,
    };
    web3utils = new Web3Utils(options);
    expect(web3utils).toBeInstanceOf(Object);
  });
});
