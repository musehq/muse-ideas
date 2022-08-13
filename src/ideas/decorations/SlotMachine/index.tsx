import { useState, Suspense, useEffect } from "react";
import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Image } from "spacesvr";
import Button from "./components/Button";

export type SlotMachineProps = {
  url?: string;
} & GroupProps;

// function StartSlot(props: SlotMachineProps) {
//     retu
// }
const icons = [
  "https://d27rt3a60hh1lx.cloudfront.net/images/casino/cherry.png",
  "https://d27rt3a60hh1lx.cloudfront.net/images/casino/diamond.png",
  "https://d27rt3a60hh1lx.cloudfront.net/images/casino/lucky7.png",
];

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function SlotMachine(props: SlotMachineProps) {
  const { url = "https://muse.place/", ...rest } = props;
  const [onClick, setOnClick] = useState(false);

  const [visible, setVisible] = useState(false);
  const [real1, setReal1] = useState(0);
  const [real2, setReal2] = useState(0);
  const [real3, setReal3] = useState(0);
  const slotGame = () => {
    // randomize
    console.log("triggered");
    setVisible(false);
    const real1 = randomIntFromInterval(0, icons.length - 1);
    const real2 = randomIntFromInterval(0, icons.length - 1);
    const real3 = randomIntFromInterval(0, icons.length - 1);
    console.log("Real 1 : " + real1);
    setReal1(real1);
    setReal2(real2);
    console.log("Real 2 : " + real2);
    setReal3(real3);
    console.log("Real 3 : " + real3);
    if (real1 === real2 && real1 === real3) {
      console.log("you win");
      setVisible(true);
    } else {
      console.log("you lose");
      setVisible(false);
    }
  };

  // useEffect(() =>{
  //   slotGame
  // },[onClick] );

  return (
    <group {...rest}>
      <group>
        <group name="realTwo">
          <Suspense fallback={<Text> Loading</Text>}>
            <Image transparent src={icons[real1]} position-x={1} />
          </Suspense>

          <Suspense fallback={null}>
            <Image transparent src={icons[real2]} position-x={0} />
          </Suspense>
          <Suspense fallback={<Text> Loading</Text>}>
            <Image transparent src={icons[real3]} position-x={-1} />
          </Suspense>
        </group>
      </group>
      <Button
        text="play"
        onClick={() => slotGame()}
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
      ;
    </group>
  );
}
