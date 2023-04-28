import {
  Image,
  Tool,
  useEnvironment,
  Interactable,
  useToolbelt,
} from "spacesvr";
import { Vector3 } from "three";

export const NAME = "ClueTool";

let MAP_URL =
  "https://www.wikihow.com/images/thumb/d/db/Get-the-URL-for-Pictures-Step-2-Version-6.jpg/v4-460px-Get-the-URL-for-Pictures-Step-2-Version-6.jpg";

export const MAP_SCALE = 0.05;
export const MAP_OFFSET = new Vector3(5.75, 0, 5);

export default function PhotoTool() {
  const { device } = useEnvironment();
  const SCALE = device.mobile ? 0.7 : 1;
  // hard code images in tools

  // onclick close image

  const toolbelt = useToolbelt();
  function CloseClue() {
    toolbelt.setActiveIndex(0);
  }
  if (window.randomimageshit != undefined) {
    MAP_URL = window.randomimageshit;
  }

  return (
    <Tool name={NAME} pos={[0, 0]}>
      <Interactable
        onClick={() => CloseClue()}
        onHovered={() => console.log("Ive been hovered!")}
        onUnHovered={() => console.log("Ive been unhovered?")}
      >
        <Image src={MAP_URL} scale={0.9} />
      </Interactable>
    </Tool>
  );
}
