import { Decision, Interaction } from "../index";
import { Idea } from "../../basis";

export function getIdeaFromDecision(decision: Decision): Idea {
  const len = decision.name.length;

  return new Idea().setFromCreation(
    hashStringToRange(decision.name, 10),
    (1 - (len === 0 ? 1 : 1 / len)) * 0.9,
    decision.utility || 1 - 1 / decision.name.length
  );
}

export function getIdeaFromInteraction(interaction: Interaction): Idea {
  const len = interaction.text.length;

  return new Idea().setFromCreation(
    hashStringToRange(interaction.text),
    (1 - (len === 0 ? 1 : 1 / len)) * 0.5,
    interaction.decisions ? 0.75 : 0.5
  );
}

const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars

const hashStringToRange = (str: string, loop = 20): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }
  const scaledLoop = loop * AVG_CHAR_VAL;
  return (count % scaledLoop) / scaledLoop;
};
