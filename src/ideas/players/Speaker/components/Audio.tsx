import { useEffect, useRef, useState } from "react";
import { GroupProps, useThree } from "@react-three/fiber";
import { AudioAnalyser, AudioListener, PositionalAudio } from "three";

type MusicProps = {
  url: string;
  volume?: number;
  radius?: number;
  setAudioAnalyser?: (aa: AudioAnalyser) => void;
  fftSize?: 64 | 128 | 256 | 512 | 1024;
} & GroupProps;

export default function Audio(props: MusicProps) {
  const {
    url,
    volume = 1.25,
    radius = 4,
    setAudioAnalyser,
    fftSize = 128,
    ...restProps
  } = props;

  const { clock, camera } = useThree();

  const posAudioRef = useRef<PositionalAudio>();
  const [posAudio, setPosAudio] = useState<PositionalAudio>();
  const audioRef = useRef<HTMLAudioElement>();
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const listenerRef = useRef<AudioListener>();

  // mount
  useEffect(() => {
    if (posAudio) return;

    const createSpeaker = () => {
      const listener = new AudioListener();
      camera.add(listener);

      const audioElement = document.createElement("audio");
      audioElement.src = url;
      audioElement.autoplay = false;
      audioElement.preload = "auto";
      audioElement.crossOrigin = "Anonymous";
      audioElement.loop = true;
      audioElement.play().then(() => {
        // sync audio in case the same audio is uploaded elsewhere
        audioElement.currentTime =
          clock.getElapsedTime() % audioElement.duration;
      });

      const positionalAudio = new PositionalAudio(listener);
      positionalAudio.setMediaElementSource(audioElement);

      // set audio analyser
      if (setAudioAnalyser) {
        setAudioAnalyser(new AudioAnalyser(positionalAudio, fftSize));
      }

      setAudio(audioElement);
      audioRef.current = audioElement;
      setPosAudio(positionalAudio);
      posAudioRef.current = positionalAudio;
      listenerRef.current = listener;
    };

    document.addEventListener("click", createSpeaker);
    document.addEventListener("touchstart", createSpeaker);
    return () => {
      document.removeEventListener("click", createSpeaker);
      document.removeEventListener("touchstart", createSpeaker);
    };
  }, [posAudio]);

  // unmount
  useEffect(() => {
    return () => {
      const _listener = listenerRef.current;
      if (_listener) {
        camera.remove(_listener);
      }
      const _audio = audioRef.current;
      if (_audio) {
        _audio.pause();
        _audio.remove();
      }
      const _sound = posAudioRef.current;
      if (_sound) {
        if (_sound.isPlaying) _sound.stop();
        if (_sound.source && (_sound.source as any)._connected)
          _sound.disconnect();
      }
    };
  }, []);

  // update url param
  useEffect(() => {
    if (!audio || audio.src === url) return;

    audio.setAttribute("src", url);
    audio.play().then(() => {
      // sync audio in case the same audio is uploaded elsewhere
      audio.currentTime = clock.getElapsedTime() % audio.duration;
    });
  }, [audio, url]);

  // update positional params
  if (posAudio) {
    posAudio.setDistanceModel("linear");
    posAudio.setRolloffFactor(1);
    posAudio.setRefDistance(1);
    posAudio.setVolume(volume);
    posAudio.setMaxDistance(Math.max(1, radius));
    posAudio.setDirectionalCone(160, 210, 0.1);
  }

  return (
    <group {...restProps}>{posAudio && <primitive object={posAudio} />}</group>
  );
}
