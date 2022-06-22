import { useControls } from "leva";
import { Manifest } from "../index";
import { useMemo } from "react";

export default function useConfig(manifest?: Manifest) {
  const settings = useMemo(() => {
    if (!manifest) return {};
    const o: any = {};
    console.log(manifest.schema);
    manifest.schema.map((scheme) => {
      const defaultVal = getDefaultFromType(scheme.type);
      if (defaultVal !== undefined) o[scheme.name] = defaultVal;
    });
    return o;
  }, [manifest]);
  const config = useControls(settings, [settings, manifest]);
  if (!manifest) return undefined;
  return config;
}

export const getDefaultFromType = (type: string) => {
  if (type === "media") return undefined;
  if (type === "image") return undefined;
  if (type === "video") return undefined;
  if (type === "string") return undefined;
  if (type === "audio") return undefined;
  if (type === "number") return 0;
  if (type === "position") return [0, 0, 0];
  if (type === "rotation") return [0, 0, 0];
  if (type === "scale") return [0, 0, 0];
  if (type === "boolean") return false;
  if (type === "color") return { r: 200, b: 125, g: 106, a: 0.4 };
  if (type === "radius") return 1;
  if (type === "float") return 1;
  return undefined;
};
