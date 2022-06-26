import { Suspense, useState } from "react";
import { GroupProps } from "@react-three/fiber";
import SpeakerModel from "./models/Speaker";
import { AudioAnalyser } from "three";
import Audio from "./components/Audio";

type SpeakerProps = {
  audioUrl?: string;
  distance?: number;
  volume?: number;
} & GroupProps;

export default function Speaker(props: SpeakerProps) {
  const {
    audioUrl = "https://d27rt3a60hh1lx.cloudfront.net/audio/nocopyright-lofi-muse.mp3",
    distance = 6,
    volume = 1, // number from 1 - 5 is recommended (this info can be added in the prop)
    ...restProps
  } = props;

  const [analyser, setAnalyser] = useState<AudioAnalyser>();

  return (
    <group name="speaker" {...restProps}>
      <Audio
        url={audioUrl}
        radius={distance}
        volume={volume * 1.25}
        setAudioAnalyser={setAnalyser}
      />
      <Suspense fallback={null}>
        <SpeakerModel analyser={analyser} />
      </Suspense>
    </group>
  );
}
