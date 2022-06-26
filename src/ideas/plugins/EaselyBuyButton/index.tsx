import { RoundedBox, Text } from "@react-three/drei";
import { useEffect, useState } from "react";
import { GroupProps } from "@react-three/fiber";
import EthPrice from "./ideas/EthPrice";
import EthWalletSelector from "./ideas/EthWalletSelector";
import Panel from "./components/Panel";
import Button from "./ideas/Button";
import QuantitySelector from "./ideas/QuantitySelector";
import type { Listing, RandomizedCollectionMintOptions } from "./utils/easely";
import {
  getListing,
  getRandomizedCollectionMintOptions,
  mintFromListing,
  NetworkType,
} from "./utils/easely";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type EaselyBuyButtonProps = {
  easelyListingId?: string;
  text?: string;
  color?: string;
} & GroupProps;

enum Stage {
  Initial = "initial", // waiting for user to interact with it
  SelectQuantity = "selectQuantity", // if listing allows selecting quantity, user can enter a quantity
  SelectWallet = "selectWallet", // select between wallets
  Processing = "processing", // talking to the blockchain
  Success = "success", // transaction went through
}

export default function EaselyBuyButton(props: EaselyBuyButtonProps) {
  const { text, easelyListingId, color = "black", ...restProps } = props;

  // internal state
  const [stage, setStage] = useState<Stage>(Stage.Initial);
  const [error, setError] = useState<string>();
  const [listing, setListing] = useState<Listing>();
  const [txHash, setTxHash] = useState<string>();
  const [numberToMint, setNumberToMint] = useState<number>();
  const [mintOptions, setMintOptions] =
    useState<RandomizedCollectionMintOptions | null>(null);

  let defaultNumberToMint = 1;
  if (mintOptions && mintOptions.fixedMintsPerTransaction !== 0) {
    defaultNumberToMint = mintOptions.fixedMintsPerTransaction;
  }

  // helper functions
  const flashError = (e: any) => {
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError(String(e));
    }

    setStage(Stage.Initial);
    setTimeout(() => setError(undefined), 5000);
  };
  const openTxHash = () => {
    if (txHash) {
      if (listing?.network === NetworkType.Rinkeby) {
        window.open(`https://rinkeby.etherscan.io/tx/${txHash}`);
      } else if (listing?.network === NetworkType.Goerli) {
        window.open(`https://goerli.etherscan.io/tx/${txHash}`);
      } else {
        window.open(`https://etherscan.io/tx/${txHash}`);
      }
    }
  };
  const reset = () => {
    setStage(Stage.Initial);
    setError(undefined);
    setTxHash(undefined);
  };
  const clickButton = () => {
    if (mintOptions && mintOptions.canSelectQuantity) {
      setStage(Stage.SelectQuantity);
      return;
    }
    setStage(Stage.SelectWallet);
  };

  useEffect(() => {
    if (!easelyListingId) {
      return;
    }

    getListing(easelyListingId)
      .then((lst) => {
        setListing(lst);
        setMintOptions(getRandomizedCollectionMintOptions(lst));
        setError(undefined);
      })
      .catch((e) => {
        flashError(e);
      });
  }, [easelyListingId]);

  const HEIGHT = 0.25;
  const WIDTH = 0.6;

  return (
    <group name="crypto-transaction-button" {...restProps}>
      <RoundedBox
        name="outline"
        args={[WIDTH + 0.05, HEIGHT + 0.025, 0.05]}
        position-z={-0.0175}
        radius={0.025}
        smoothness={10}
      >
        <meshStandardMaterial color={color} />
      </RoundedBox>

      <Panel enabled={!listing && !error} width={WIDTH} height={HEIGHT}>
        Loading...
      </Panel>

      <Panel
        enabled={stage === Stage.Initial && !!listing && !error && !txHash}
        width={WIDTH}
        height={HEIGHT}
        onClick={clickButton}
      >
        {/* @ts-ignore */}
        <Text font={FONT_FILE} color={color} fontSize={0.075} position-y={0.04}>
          {text}
        </Text>
        <EthPrice
          amount={listing?.priceInEth ?? 0}
          position-y={-0.03}
          textStyles={{ color }}
        />
      </Panel>

      {mintOptions && mintOptions.canSelectQuantity ? (
        <Panel
          enabled={
            stage === Stage.SelectQuantity && !!listing && !error && !txHash
          }
          width={WIDTH}
          height={HEIGHT}
        >
          <QuantitySelector
            min={1}
            max={mintOptions.maxMintsPerTransaction}
            initialValue={defaultNumberToMint}
            onChange={setNumberToMint}
            onProceed={() => {
              setStage(Stage.SelectWallet);
            }}
            onBack={() => {
              setStage(Stage.Initial);
            }}
            textStyles={{ color }}
          />
        </Panel>
      ) : null}

      <Panel
        enabled={stage === Stage.SelectWallet && !!listing && !error && !txHash}
        width={WIDTH}
        height={HEIGHT}
      >
        <EthWalletSelector
          onConnect={(web3) => {
            if (!listing) {
              throw new Error("no listing?");
            }
            setStage(Stage.Processing);
            return mintFromListing(
              web3,
              listing,
              numberToMint || defaultNumberToMint,
              (h) => {
                setTxHash(h);
                setStage(Stage.Success);
              }
            );
          }}
          onBack={() => {
            setStage(
              mintOptions?.canSelectQuantity
                ? Stage.SelectQuantity
                : Stage.Initial
            );
          }}
          setError={flashError}
        />
      </Panel>

      <Panel
        enabled={stage == Stage.Processing && !error && !txHash}
        width={WIDTH}
        height={HEIGHT}
      >
        {/* @ts-ignore */}
        <Text
          font={FONT_FILE}
          color={color}
          fontSize={0.04}
          maxWidth={WIDTH * 0.8}
          position-z={0.03}
          textAlign="center"
        >
          Working on it...
        </Text>
      </Panel>

      <Panel enabled={!!txHash} width={WIDTH} height={HEIGHT}>
        {/* @ts-ignore */}
        <Text
          font={FONT_FILE}
          color="green"
          fontSize={0.03}
          position-z={0.03}
          position-y={0.05}
        >
          Success!
        </Text>
        <Button onClick={openTxHash} size={0.5} width={5} position-y={-0.015}>
          View transaction
        </Button>
        <Button onClick={reset} size={0.5} width={5} position-y={-0.065}>
          Return
        </Button>
      </Panel>

      <Panel enabled={!!error} width={WIDTH} height={HEIGHT}>
        {/* @ts-ignore */}
        <Text
          color="red"
          font={FONT_FILE}
          fontSize={0.02}
          maxWidth={WIDTH * 0.8}
          position-z={0.03}
          textAlign="center"
        >
          {error}
        </Text>
      </Panel>
    </group>
  );
}
