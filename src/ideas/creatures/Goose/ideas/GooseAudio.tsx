import { useFrame, useLoader } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import { AudioLoader, PositionalAudio as PositionalAudioImpl } from "three";
import { useEffect, useRef } from "react";
import { useLimitedFrame } from "spacesvr";

const CONTENT_LIBRARY = "https://d27rt3a60hh1lx.cloudfront.net/content/goose";
const FILE_1 = `${CONTENT_LIBRARY}/footstep_carpet_003.mp3`;
const FILE_2 = `${CONTENT_LIBRARY}/footstep_carpet_004.mp3`;

type GooseAudioProps = {
  walking?: boolean;
};

export default function GooseAudio(props: GooseAudioProps) {
  const { walking = false } = props;

  const audio1 = useRef<PositionalAudioImpl>();
  const audio2 = useRef<PositionalAudioImpl>();

  useLimitedFrame(3.5, () => {
    if (Math.random() > 0.9 || !audio1.current || !audio2.current || !walking) {
      return;
    }

    const audio = Math.random() > 0.5 ? audio1.current : audio2.current;
    audio.setVolume(Math.random() * 0.1 + 0.05);
    audio?.setDetune(Math.random() * 0.1 - 0.05);
    audio.play();
  });

  return (
    <group name="goose-audio">
      <PositionalAudio
        ref={audio1}
        url={FILE_1}
        loop={false}
        autoplay={false}
      />
      <PositionalAudio
        ref={audio2}
        url={FILE_2}
        loop={false}
        autoplay={false}
      />
    </group>
  );
}
