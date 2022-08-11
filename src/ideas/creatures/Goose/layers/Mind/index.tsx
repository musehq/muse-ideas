import { createContext, ReactNode, useContext } from "react";
import { Vector3 } from "three";
import { useLimitedFrame } from "spacesvr";
import { RenderCallback } from "@react-three/fiber";

export interface Mind {
  target: Vector3;
  update: RenderCallback;
}

type MindState = { target: Vector3 };
export const MindContext = createContext({} as MindState);
export const MindConsumer = MindContext.Consumer;
export const useMind = () => useContext(MindContext);

type MindProps = {
  mind: Mind;
  children: ReactNode | ReactNode[];
};

export default function MindLayer(props: MindProps) {
  const { mind, children } = props;

  useLimitedFrame(20, (st, delt) => mind.update(st, delt));

  const value = { target: mind.target };

  return <MindContext.Provider value={value}>{children}</MindContext.Provider>;
}
