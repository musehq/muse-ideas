import { Camera, StandardReality } from "spacesvr";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Perf } from "r3f-perf";
import Wings from "realities/DeveloperReality/tools/Wings";
import useConfig from "./logic/config";

export type Type = {
  name: string;
  type: string;
};

export type Schema = Type[];

export type NpmDependencies = {
  [key: string]: string;
};

export type Manifest = {
  id: string;
  name: string;
  purpose: string;
  schema: Schema;
  npm_dependencies: NpmDependencies;
  predecessor?: string;
  data_url?: string;
};

type DevelopState = { config?: { [x: string]: any } };
export const DevelopContext = createContext({} as DevelopState);
export const DevelopConsumer = DevelopContext.Consumer;
export const useDevelop = () => useContext(DevelopContext);

type DevelopProps = {
  children: ReactNode | ReactNode[];
};
export default function Develop(props: DevelopProps) {
  const { children } = props;

  const [manifest, setManifest] = useState<Manifest>();

  useEffect(() => {
    import("../../../../ideas" + window.location.pathname + "/idea.json")
      .then((result) => setManifest(result))
      .catch((err) =>
        console.error(
          "error loading manifest, make sure an idea.json is present",
          err
        )
      );
  }, []);

  const IS_LAND = window.location.pathname.includes("/lands/");
  const IS_DEV_ENV = process.env.NODE_ENV === "development";

  const config = useConfig(manifest);

  const value = { config };

  return (
    <StandardReality
      environmentProps={{
        canvasProps: { camera: { far: 300 } },
        dev: IS_DEV_ENV,
      }}
      playerProps={{
        pos: IS_LAND ? [0, 1, 0] : [0, 1, 4],
        controls: { disableGyro: true },
      }}
      disableGround={IS_LAND}
    >
      <DevelopContext.Provider value={value}>
        <Perf position="top-left" />
        <Wings />
        <Camera />
        {children}
      </DevelopContext.Provider>
    </StandardReality>
  );
}
