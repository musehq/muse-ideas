import { Image, useToolbelt, useEnvironment, Interactable } from "spacesvr";
import { Vector3 } from "three";
import { GroupProps } from "@react-three/fiber";

const MAP_URL =
  "https://www.wikihow.com/images/thumb/d/db/Get-the-URL-for-Pictures-Step-2-Version-6.jpg/v4-460px-Get-the-URL-for-Pictures-Step-2-Version-6.jpg";

export const MAP_SCALE = 0.05;
export const MAP_OFFSET = new Vector3(5.75, 0, 5);
type ClueProps = {
  clue?: string;
} & GroupProps;
export default function Clue(props: ClueProps) {
  const { clue = MAP_URL } = props;
  const { device } = useEnvironment();
  const SCALE = device.mobile ? 0.7 : 1;
  // hard code images in tools

  // onclick close image

  const toolbelt = useToolbelt();

  const testImage = clue;
  const OpenClue = () => {
    let i = 0;
    console.log("open clue");
    console.log(toolbelt.tools);
    window.randomimageshit = testImage;
    toolbelt.tools.forEach((tool) => {
      console.log(tool);
      if (tool.name === "ClueTool") {
        toolbelt.setActiveIndex(i);
      }
      i += 1;
    });
  };

  return (
    <Interactable onClick={() => OpenClue()}>
      <Image src={clue} scale={0.9} />
    </Interactable>
  );
}
