import Grid from "./components/Grid";
import Movable from "./components/Movable";
import { ReactNode } from "react";
import { LostWorld } from "spacesvr";

type DevelopProps = {
  children: ReactNode | ReactNode[];
};

export default function Debug(props: DevelopProps) {
  const IS_LAND = window.location.href.includes("/land/");

  return (
    <>
      <Movable>
        <Grid>{props.children}</Grid>
      </Movable>
      {!IS_LAND && <LostWorld />}
    </>
  );
}
