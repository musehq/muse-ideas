import { GroupProps, useFrame } from "@react-three/fiber";
import { useSpatialVideo } from "./utils/video";
import { DoubleSide, Group, sRGBEncoding, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEnvironment, useLimiter } from "spacesvr";
import { Text } from "@react-three/drei";

type VideoPlayerProps = {
  videoSrc?: string;
  videoDistance?: number;
  framed?: boolean;
  volume?: number;
  restartOnEnter?: boolean;
  audioDistance?: number;
  frameColor?: string;
  previewColor?: string;
  previewText?: string;
  previewTextColor?: string;
  previewTextFont?: string;
  previewTextSize?: number;
} & GroupProps;

export default function VideoPlayer(props: VideoPlayerProps) {
  const {
    videoSrc = "https://d27rt3a60hh1lx.cloudfront.net/content/silksbyvp/video.mp4",
    videoDistance = 5,
    framed = false,
    volume = 1,
    restartOnEnter = false,
    audioDistance = 5,
    frameColor = "#888",
    previewColor = "black",
    previewText = "",
    previewTextColor = "white",
    previewTextFont = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf",
    previewTextSize = 0.05,
    ...rest
  } = props;

  const { device } = useEnvironment();
  const group = useRef<Group>(null);
  const [play, setPlay] = useState(false);

  const { video, posAudio, dims } = useSpatialVideo(videoSrc, {
    audioDistance,
    volume,
    muted: device.mobile ? !play : false,
  });

  const max = Math.max(dims.width, dims.height);
  const width = dims.width / max;
  const height = dims.height / max;

  const dummy = useMemo(() => new Vector3(), []);

  const limiter = useLimiter(10);
  useFrame(({ clock, camera }) => {
    if (!limiter.isReady(clock) || !group.current) return;

    group.current.getWorldPosition(dummy);
    const dist = camera.position.distanceTo(dummy);
    if (!play && dist < videoDistance) {
      setPlay(true);
    } else if (play && dist > videoDistance) {
      setPlay(false);
    }
  });

  useEffect(() => {
    if (video && play && restartOnEnter) {
      video.currentTime = 0;
    }
  }, [play, restartOnEnter, video]);

  const BORDER = 0.025;
  const BOTTOM_LIP = 0.01;

  return (
    <group name="video-player" {...rest}>
      <group ref={group}>
        <mesh>
          <planeBufferGeometry args={[width, height]} />
          {video && play ? (
            <meshBasicMaterial side={DoubleSide}>
              <videoTexture
                attach="map"
                args={[video]}
                encoding={sRGBEncoding}
              />
            </meshBasicMaterial>
          ) : (
            <meshStandardMaterial color={previewColor} side={DoubleSide} />
          )}
        </mesh>
        {!play && previewText && (
          <>
            {/* @ts-ignore */}
            <Text
              color={previewTextColor}
              maxWidth={width * 0.95}
              textAlign="center"
              position-z={0.001}
              font={previewTextFont}
              fontSize={previewTextSize}
            >
              {previewText}
            </Text>
          </>
        )}
        {framed && (
          <mesh
            name="frame"
            position-y={-BOTTOM_LIP}
            position-z={-0.05 / 2 - 0.001}
          >
            <boxBufferGeometry
              args={[width + BORDER, height + BORDER + BOTTOM_LIP, 0.05]}
            />
            <meshLambertMaterial color={frameColor} />
          </mesh>
        )}
        {posAudio && <primitive object={posAudio} />}
      </group>
    </group>
  );
}
