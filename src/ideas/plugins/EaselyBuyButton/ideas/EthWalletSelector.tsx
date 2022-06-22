import { getMetamaskProvider } from "../utils/eth";
import { Image, Interactable } from "spacesvr";
// @ts-ignore
import Web3 from "web3/dist/web3.min.js";
import { TransactionReceipt } from "web3-core";
import Button from "./Button";

const METAMASK_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png";

type WalletType = "metamask";

type Wallet = {
  name: string;
  image: string;
  onClick: () => any;
};

type EthWalletSelectorProps = {
  // @ts-ignore
  onConnect: (web3: Web3) => Promise<TransactionReceipt>;
  onBack: () => void;
  setError: (e: string) => void;
};

export default function EthWalletSelector(props: EthWalletSelectorProps) {
  const { onConnect, onBack, setError } = props;

  const mintWithWallet = async (walletType: WalletType) => {
    try {
      let web3;
      if (walletType === "metamask") {
        web3 = await getMetamaskProvider();
      }
      if (!web3) {
        setError("No wallet found");
        return;
      }
      await onConnect(web3);
    } catch (e: any) {
      setError(e?.message || "unknown error");
    }
  };

  const wallets: Wallet[] = [
    {
      name: "metamask",
      image: METAMASK_IMG,
      onClick: () => mintWithWallet("metamask"),
    },
  ];

  return (
    <group name="eth-wallet-selector">
      {wallets.map((wallet, i) => (
        <group
          key={`${wallet}-${i}`}
          name={`${wallet.name}-button`}
          position-x={(i + 0.5 - wallets.length / 2) * 0.22}
        >
          <Interactable onClick={() => wallet.onClick()}>
            <Image src={wallet.image} size={0.175} />
          </Interactable>
        </group>
      ))}
      <Button
        onClick={onBack}
        size={0.5}
        width={0.5}
        position-x={-0.25}
        position-y={0.09}
        color="gray"
      >
        {"<"}
      </Button>
    </group>
  );
}
