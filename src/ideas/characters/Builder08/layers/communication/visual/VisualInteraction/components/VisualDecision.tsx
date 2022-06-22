import { Box } from "@react-three/flex";
import FacePlayer from "../../modifiers/FacePlayer";
import { Decision } from "../../../index";
import { useContext } from "react";
import { DialogueContext } from "../../VisualDialogue";
import Button from "../../components/Button";
import { getIdeaFromDecision } from "../../../utils/helper";

export default function VisualDecision(props: Decision) {
  const { ...decision } = props;

  const { setKey } = useContext(DialogueContext);

  const WIDTH = decision.name.length * 0.2825 + 0.275;
  const idea = getIdeaFromDecision(decision);

  return (
    <Box
      marginTop={0.01}
      marginBottom={0.01}
      marginLeft={0.05}
      marginRight={0.05}
      width={WIDTH * 0.1}
      height={0.1}
      centerAnchor
    >
      <FacePlayer key={`${decision.name}`}>
        <Button
          width={WIDTH}
          idea={idea}
          onClick={() => {
            if (decision.onClick) decision.onClick();
            if (decision.nextKey) setKey(decision.nextKey || "");
          }}
        >
          {decision.name}
        </Button>
      </FacePlayer>
    </Box>
  );
}
