import { Suspense, useState } from "react";
import { GroupProps } from "@react-three/fiber";

import { Model, Interactable, useToolbelt } from "spacesvr";

// import Audio from "./components/Audio";
import { setConstantValue } from "typescript";

type SpeakerProps = {
  audioUrl?: string;
  model?: string;
  volume?: number;
} & GroupProps;

export default function PhoneClue(props: SpeakerProps) {
  const {
    model = "https://d1htv66kutdwsl.cloudfront.net/28113aac-1d4d-445b-b60f-8a52506bab98/8f883243-3b23-4efa-99e3-6e764b0b419d.glb",
    audioUrl = "https://d27rt3a60hh1lx.cloudfront.net/audio/nocopyright-lofi-muse.mp3",
    ...restProps
  } = props;

  const toolbelt = useToolbelt();
  const [audioPlaying, setAudioPlaying] = useState(false);

  // create instance of audio player
  const a = document.createElement("audio");
  a.src = audioUrl;
  a.autoplay = false;
  a.preload = "auto";
  a.crossOrigin = "Anonymous";
  a.loop = false;

  const testImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrPh_Mgk_7KitQLJ0cbmjYFiTdK6962Gz7eAJ3MZWY0g&s";
  const OpenClue = () => {
    let i = 0;
    console.log("open clue");
    console.log(toolbelt.tools);
    console.log("audio status" + a.paused);
    if (a.paused && !audioPlaying) {
      a.play();
      console.log("play  auido");
      setAudioPlaying(true);
    }

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
    <group name="phone-clue" {...restProps}>
      <Suspense fallback={null}>
        <Interactable onClick={() => OpenClue()}>
          <Model src={model} scale={0.01} />
        </Interactable>
      </Suspense>
    </group>
  );
}
