import { RoundedBox, Text } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { GroupProps } from "@react-three/fiber";
import EthPrice from "./ideas/EthPrice";
import EthWalletSelector from "./ideas/EthWalletSelector";
import Panel from "./components/Panel";
import { ethers, Transaction } from "ethers";
import Button from "./ideas/Button";
import { Idea } from "./layers/basis";
import { analytics } from "./utils/analytics";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type EthTransactButtonProps = {
  text?: string;
  amount?: number;
  receiveAddress?: string;
  color?: string;
} & GroupProps;

export default function EthTransactButton(props: EthTransactButtonProps) {
  const {
    text = "donate pls",
    amount = 0.01,
    receiveAddress = "",
    color = "black",
    ...restProps
  } = props;

  //found by taking a small sample and getting line of best fit
  const HEIGHT = 0.25;
  const WIDTH = Math.max(
    Math.max(text.length * 0.035 + 0.13, `${amount}`.length * 0.04 + 0.13),
    0.6
  );

  // internal state
  const seed = useMemo(() => Math.random(), []);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string>();
  const [tx, setTx] = useState<Transaction>();

  // helper functions
  const assertTx = (tx: Transaction) => {
    setStage(2);
    setTx(tx);
  };
  const flashError = (s: string) => {
    setError(s);
    setStage(0);
    setTimeout(() => setError(undefined), 5000);
  };
  const openTxHash = () => {
    if (tx) window.open(`https://etherscan.io/tx/${tx.hash}`);
  };
  const reset = () => {
    setStage(0);
    setError(undefined);
    setTx(undefined);
  };
  const clickButton = () => {
    analytics.capture("idea-eth_transact_button-click", props);
    setStage(1);
  };

  // some state hooks
  useEffect(() => {
    if (!ethers.utils.isAddress(receiveAddress)) {
      setError("please enter a valid receive address to begin");
    } else {
      setError(undefined);
    }
  }, [receiveAddress]);

  return (
    <group name="crypto-transaction-button" {...restProps}>
      <RoundedBox
        name="outline"
        args={[WIDTH + 0.05, HEIGHT + 0.025, 0.05]}
        position-z={-0.0175}
        radius={0.025}
        smoothness={10}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
          flatShading={false}
        />
      </RoundedBox>

      <Panel
        enabled={stage === 0 && !error && !tx}
        width={WIDTH}
        height={HEIGHT}
        onClick={clickButton}
      >
        {/* @ts-ignore */}
        <Text font={FONT_FILE} color={color} fontSize={0.075} position-y={0.04}>
          {text}
        </Text>
        <EthPrice amount={amount} position-y={-0.03} />
      </Panel>

      <Panel
        enabled={stage === 1 && !error && !tx}
        width={WIDTH}
        height={HEIGHT}
      >
        <EthWalletSelector
          trigger={stage === 1 && !error && !tx}
          amount={amount}
          address={receiveAddress}
          setError={flashError}
          setTx={assertTx}
        />
      </Panel>

      <Panel enabled={!!tx} width={WIDTH} height={HEIGHT}>
        {/* @ts-ignore */}
        <Text color="green" fontSize={0.03} position-y={0.075}>
          success!
        </Text>
        <Button
          onClick={openTxHash}
          idea={new Idea().setFromCreation(seed, 0.7, 0.7)}
          size={0.5}
          width={5}
          position-y={0.01}
        >
          view transaction
        </Button>
        <Button
          onClick={reset}
          idea={new Idea().setFromCreation((seed + 0.5) % 1, 0.7, 0.7)}
          size={0.5}
          width={5}
          position-y={-0.065}
        >
          go again
        </Button>
      </Panel>

      <Panel enabled={!!error} width={WIDTH} height={HEIGHT}>
        {/* @ts-ignore */}
        <Text
          color="red"
          fontSize={0.02}
          maxWidth={WIDTH * 0.8}
          textAlign="center"
        >
          {error}
        </Text>
      </Panel>
    </group>
  );
}
