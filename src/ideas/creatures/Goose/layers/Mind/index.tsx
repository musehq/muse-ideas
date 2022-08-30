import { createContext, ReactNode, useContext } from "react";
import { Vector3 } from "three";
import { RenderCallback } from "@react-three/fiber";
import { useLimitedFrame } from "spacesvr";

export interface Mind {
  state: any;
  target: Vector3;
  tick: RenderCallback;
  sendSignal: (s: string) => void;
}

type MindState = {
  target: Vector3;
  state: any;
  sendSignal: (s: string) => void;
};
export const MindContext = createContext({} as MindState);
export const MindConsumer = MindContext.Consumer;
export const useMind = () => useContext(MindContext);

type MindProps = {
  mind: Mind;
  children: ReactNode | ReactNode[];
};

export default function MindLayer(props: MindProps) {
  const { mind, children } = props;

  useLimitedFrame(20, (s, d) => mind.tick(s, d));

  return <MindContext.Provider value={mind}>{children}</MindContext.Provider>;
}
