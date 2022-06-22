import { useState } from "react";
import NFTChecker from "./components/NFTChecker";
import Centrify from "./components/Centrify";
import { GroupProps } from "@react-three/fiber";
import Wall from "./components/Wall";
import Message from "./components/Message";

export type NFTGatewayProps = {
  enabled?: boolean;
  address?: string;
  chain?: string;
  wallOrSphere?: boolean;
  barrierSize?: number;
  backgroundImage?: string;
} & GroupProps;

export default function DropPartyNFTGateway(props: NFTGatewayProps) {
  const {
    enabled = false,
    address,
    chain = "ETH",
    wallOrSphere = false,
    barrierSize = 6,
    backgroundImage = "https://t3.ftcdn.net/jpg/02/88/89/90/360_F_288899075_TV8KKBLTOnG0Dby3IC61UCUeNiBK0puK.jpg",
    ...rest
  } = props;

  const [owner, setOwner] = useState(false);

  const IS_WALL = !wallOrSphere;
  const IS_SPHERE = wallOrSphere;
  const RENDER_BARRIER = address && enabled;

  const SIZE = Math.max(barrierSize, 1);

  return (
    <group name="drop-party-nft-gateway" {...rest} scale={1}>
      {!address && <Message>enter an nft collection address to begin</Message>}
      {address && (
        <NFTChecker
          address={address}
          chain={chain}
          media={backgroundImage}
          setOwner={setOwner}
        />
      )}
      {RENDER_BARRIER && IS_SPHERE && (
        <Centrify enabled={!owner} distance={SIZE} />
      )}
      {RENDER_BARRIER && IS_WALL && <Wall enabled={!owner} size={SIZE} />}
    </group>
  );
}
