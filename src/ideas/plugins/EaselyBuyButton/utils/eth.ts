// @ts-ignore
import Web3 from "web3/dist/web3.min.js";

declare global {
  interface Window {
    ethereum: any;
  }
}

// @ts-ignore
export const getMetamaskProvider = async (): Promise<Web3> => {
  if (!window.ethereum) {
    window.open("https://metamask.io/download.html", "_blank");
    throw new Error("Please install MetaMask");
  }
  await window.ethereum.send("eth_requestAccounts");
  return new Web3(window.ethereum);
};
