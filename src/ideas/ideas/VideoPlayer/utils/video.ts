import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { AudioListener, PositionalAudio, Vector2 } from "three";

type SpatialVideoProps = {
  volume: number;
  muted: boolean;
  audioDistance: number;
};

export const useSpatialVideo = (
  src: string | undefined,
  props?: Partial<SpatialVideoProps>
) => {
  const { muted = false, volume = 1, audioDistance = 5 } = props || {};

  const { camera } = useThree();

  const listenerRef = useRef<AudioListener>();
  const posAudioRef = useRef<PositionalAudio>();
  const [posAudio, setPosAudio] = useState<PositionalAudio>();
  const [dims, setDims] = useState<Vector2>(new Vector2(1920, 1080));
  const [video, setVideo] = useState<HTMLVideoElement>();
  const videoRef = useRef<HTMLVideoElement>();

  // mount, don't play
  useEffect(() => {
    if (video || posAudio) return;

    const createVideoAndSpeaker = () => {
      const vid = document.createElement("video");
      vid.autoplay = false;
      vid.muted = muted;
      vid.loop = true;
      vid.playsInline = true;
      vid.crossOrigin = "Anonymous";
      vid.addEventListener("loadedmetadata", () =>
        setDims(new Vector2(vid.videoWidth, vid.videoHeight))
      );

      const listener = new AudioListener();
      camera.add(listener);

      const speak = new PositionalAudio(listener);
      speak.setMediaElementSource(vid);

      videoRef.current = vid;
      setVideo(vid);
      setPosAudio(speak);
      posAudioRef.current = speak;
      listenerRef.current = listener;
    };

    document.addEventListener("click", createVideoAndSpeaker);
    document.addEventListener("touchstart", createVideoAndSpeaker);
    return () => {
      document.removeEventListener("click", createVideoAndSpeaker);
      document.removeEventListener("touchstart", createVideoAndSpeaker);
    };
  }, [video, posAudio]);

  // unmount
  useEffect(() => {
    return () => {
      const _listener = listenerRef.current;
      if (_listener) {
        camera.remove(_listener);
      }
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.remove();
        setVideo(undefined);
      }
      const _sound = posAudioRef.current;
      if (_sound) {
        _sound.stop();
        try {
          _sound.disconnect();
        } catch (e) {
          console.error(e);
        }
        setPosAudio(undefined);
      }
    };
  }, []);

  // update url param
  useEffect(() => {
    const playVideo = () => {
      if (!video || !src) return;
      if (video.src !== src) {
        video.setAttribute("src", src);
        video.pause();
      }
      if (video.paused) video.play();
    };

    playVideo();

    document.addEventListener("click", playVideo);
    document.addEventListener("touchstart", playVideo);
    return () => {
      document.removeEventListener("click", playVideo);
      document.removeEventListener("touchstart", playVideo);
    };
  }, [video, src]);

  // update video params
  if (video) {
    video.muted = muted;
  }

  // update pos audio params
  if (posAudio) {
    posAudio.setDistanceModel("linear");
    posAudio.setRolloffFactor(1);
    posAudio.setRefDistance(1);
    posAudio.setVolume(volume);
    posAudio.setMaxDistance(Math.max(1, audioDistance));
    posAudio.setDirectionalCone(160, 210, 0.1);
  }

  return { posAudio, video, dims };
};
