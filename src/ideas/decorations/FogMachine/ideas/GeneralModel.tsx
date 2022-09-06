import { GroupProps } from "@react-three/fiber";
import { useModel } from "spacesvr";

type GeneralModelProps = { url: string } & GroupProps;

export default function GeneralModel(props: GeneralModelProps) {
  const { url, ...rest } = props;
  const gltf = useModel(url);
  return <primitive object={gltf.scene} {...rest} />;
}
