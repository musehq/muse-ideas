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
  if (type === "media")
    return "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/weathered_brown_planks/weathered_brown_planks_diff_1k.jpg";
  if (type === "image")
    return "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/weathered_brown_planks/weathered_brown_planks_diff_1k.jpg";
  if (type === "video") return "https://www.w3schools.com/html/mov_bbb.mp4";
  if (type === "hdr")
    return "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rainforest_trail_1k.hdr";
  if (type === "gltf")
    return "https://d27rt3a60hh1lx.cloudfront.net/models/PinkGreenDurag-1613176796/pinkgreendurag.glb";
  if (type === "string") return "";
  if (type === "audio") return "https://www.w3schools.com/html/horse.mp3";
  if (type === "number") return 0;
  if (type === "position") return [0, 0, 0];
  if (type === "rotation") return [0, 0, 0];
  if (type === "scale") return [1, 1, 1];
  if (type === "boolean") return false;
  if (type === "color") return "#ffffff";
  if (type === "radius") return 1;
  if (type === "float") return 1;
  return undefined;
};
