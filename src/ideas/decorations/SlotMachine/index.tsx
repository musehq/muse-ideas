import { useState, Suspense, useEffect } from "react";
import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Image } from "spacesvr";
import Button from "./components/Button";

export type SlotMachineProps = {
  url?: string;
  pictureA?: string;
  pictureB?: string;
  pictureC?: string;
  pictureD?: string;
  playsPerDay?: number;
  numOfIcons?: number;
} & GroupProps;

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setWithExpiry(key: string, value: number, ttl: number) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export default function SlotMachine(props: SlotMachineProps) {
  const {
    url = "https://muse.place/",
    pictureA = "https://d27rt3a60hh1lx.cloudfront.net/images/casino/cherry.png",
    pictureB = "https://d27rt3a60hh1lx.cloudfront.net/images/casino/diamond.png",
    pictureC = "https://d27rt3a60hh1lx.cloudfront.net/images/casino/lucky7.png",
    pictureD = "https://d27rt3a60hh1lx.cloudfront.net/images/casino/grape.png",
    playsPerDay = 3,
    numOfIcons = 4,
    ...rest
  } = props;

  const icons = [pictureA, pictureB, pictureC, pictureD];

  const [visible, setVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [real1, setReal1] = useState(0);
  const [real2, setReal2] = useState(0);
  const [real3, setReal3] = useState(0);

  const slotGame = () => {
    console.log("triggered");
    setVisible(false);

    let iconsUsed = numOfIcons;
    if (numOfIcons > 4) {
      iconsUsed = 4;
    }
    const real1Result = randomIntFromInterval(0, iconsUsed - 1);
    const real2Result = randomIntFromInterval(0, iconsUsed - 1);
    const real3Result = randomIntFromInterval(0, iconsUsed - 1);

    setReal1(real1Result);
    setReal2(real2Result);
    setReal3(real3Result);
    if (real1Result === real2Result && real1Result === real3Result) {
      console.log("you win");
      setVisible(true);
    } else {
      console.log("you lose");
      setVisible(false);
    }
  };

  const slotExecuteGame = () => {
    if (
      getWithExpiry("playsToday") == null ||
      getWithExpiry("playsToday") < playsPerDay
    ) {
      setMessageVisible(false);
      let plays = 0;
      if (getWithExpiry("playsToday") != null) {
        plays = getWithExpiry("playsToday");
      }
      slotGame();
      plays += 1;
      setWithExpiry("playsToday", plays, 86400);
    } else {
      setMessageVisible(true);
    }
  };

  return (
    <group name="slot-machine" {...rest}>
      <group>
        <group name="realTwo">
          <Suspense fallback={<Text> Loading</Text>}>
            <Image transparent src={icons[real1]} position-x={1} />
          </Suspense>

          <Suspense fallback={<Text> Loading</Text>}>
            <Image transparent src={icons[real2]} position-x={0} />
          </Suspense>
          <Suspense fallback={<Text> Loading</Text>}>
            <Image transparent src={icons[real3]} position-x={-1} />
          </Suspense>
        </group>
      </group>
      <Button
        text="play"
        onClick={() => slotExecuteGame()}
        position-z={1}
        position-y={-1}
      />
      {visible ? (
        <Button
          text="you win, click to redeem"
          position-x={1.2}
          position-y={-1}
          position-z={1}
          onClick={() => window.open(url, "_blank")}
        />
      ) : undefined}
      {messageVisible ? (
        <Text position-x={0} position-y={-0.4} position-z={1} color="red">
          You are out of plays. Try again tomorrow.
        </Text>
      ) : undefined}
    </group>
  );
}
