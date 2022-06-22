import { getMetamaskProvider, sendPayment } from "../utils/eth";
import { Image, Interactable, useEnvironment } from "spacesvr";
import { ethers } from "ethers";
import { useEffect } from "react";
import { analytics } from "../utils/analytics";

const METAMASK_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png";

const WALLETCONNECT_IMAGE = "https://i.imgur.com/6W0yKmv.png";

type WalletType = "metamask" | "walletconnect";

type Wallet = {
  name: string;
  image: string;
  onClick: (amount: number, address: string) => any;
};

type EthWalletSelectorProps = {
  trigger: boolean;
  amount: number;
  address: string;
  setError: (e: string) => void;
  setTx: (tx: ethers.Transaction) => void;
};

export default function EthWalletSelector(props: EthWalletSelectorProps) {
  const { trigger, amount, address, setError, setTx } = props;

  const { device } = useEnvironment();

  const payWithWallet = async (walletType: WalletType) => {
    try {
      let provider;
      if (walletType === "metamask") {
        provider = await getMetamaskProvider();
      }
      if (!provider) {
        throw Error("wallet not found");
      }
      const tx = await sendPayment(amount, address, provider);
      setTx(tx);
      analytics.capture("idea-eth_transact_button-send", {
        amount,
        currency: "ETH",
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
      });
    } catch (e: any) {
      console.error(e);
      analytics.capture("idea-eth_transact_button-error", {
        message: e?.message || "unknown error",
      });
      setError(e?.message || "unknown error");
    }
  };

  // build wallet selections
  const wallets: Wallet[] = [
    {
      name: "walletconnect",
      image: WALLETCONNECT_IMAGE,
      onClick: () => payWithWallet("walletconnect"),
    },
  ];
  if (!device.mobile) {
    wallets.unshift({
      name: "metamask",
      image: METAMASK_IMG,
      onClick: () => payWithWallet("metamask"),
    });
  }

  // trigger walletconnect shit if mobile detected
  useEffect(() => {
    if (trigger && device.mobile) payWithWallet("walletconnect");
  }, [device.mobile, trigger]);

  return (
    <group name="eth-wallet-selector">
      {wallets.map((wallet, i) => (
        <group
          key={`${wallet}-${i}`}
          name={`${wallet.name}-button`}
          position-x={(i + 0.5 - wallets.length / 2) * 0.3}
        >
          <Interactable onClick={() => wallet.onClick(amount, address)}>
            <Image src={wallet.image} size={0.175} />
          </Interactable>
        </group>
      ))}
    </group>
  );
}
