import Grid from "./components/Grid";
import { ReactNode } from "react";
import { LostWorld } from "spacesvr";
import { Debug as PhysicsDebug } from "@react-three/cannon";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

type DevelopProps = {
  children: ReactNode | ReactNode[];
};

export default function Debug(props: DevelopProps) {
  const IS_LAND = window.location.href.includes("/lands/");

  const config = useControls("Debug Props", {
    enable: false,
    physicsColor: "#ff0000",
  });

  const Parent = config.enable
    ? (props: { children: ReactNode | ReactNode[] }) => (
        <PhysicsDebug color={config.physicsColor}>
          {props.children}
        </PhysicsDebug>
      )
    : (props: { children: ReactNode | ReactNode[] }) => (
        <group>{props.children}</group>
      );

  return (
    <Parent>
      {config.enable && (
        <>
          <Grid />
          <Perf position="top-left" />
        </>
      )}
      {!IS_LAND && <LostWorld />}
      {props.children}
    </Parent>
  );
}
