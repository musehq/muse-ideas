import { ethers } from "ethers";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export const getMetamaskProvider = async () => {
  if (!window.ethereum) throw new Error("No ethereum provider found");
  await window.ethereum.send("eth_requestAccounts");
  return new ethers.providers.Web3Provider(window.ethereum);
};

export const sendPayment = async (
  amount: number,
  address: string,
  provider: Web3Provider
): Promise<TransactionResponse> => {
  const signer = provider.getSigner();
  const value = ethers.utils.parseEther(amount.toString());
  return await signer.sendTransaction({
    value,
    to: address,
    gasLimit: 21000,
  });
};
