import { Image, useLimiter, Video } from "spacesvr";
import * as THREE from "three";
import { Group, Mesh, Vector3 } from "three";
import { useMemo, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { GroupProps, useFrame } from "@react-three/fiber";

export type ProximityMediaProps = {
  media?: string;
  framed?: boolean;
  frameColor?: string;
  radius?: number;
  displayRadius?: boolean;
} & GroupProps;

export default function ProximityMedia(props: ProximityMediaProps) {
  const {
    media = "https://d27rt3a60hh1lx.cloudfront.net/images/turtle.jpg",
    framed = false,
    frameColor = "#111111",
    radius = 2,
    displayRadius = false,
    ...rest
  } = props;

  const RADIUS = Math.max(radius, 0.5);

  const ref = useRef<Group>(null);
  const circleRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);
  const { scale } = useSpring({ scale: visible ? 1 : 0 });
  const dummy = useMemo(() => new Vector3(), []);

  const modUrl = media.toLowerCase();
  const IS_VIDEO = modUrl.endsWith(".mp4");
  const IS_IMAGE =
    modUrl.endsWith(".jpg") ||
    modUrl.endsWith(".jpeg") ||
    modUrl.endsWith(".png");

  const frameMat = new THREE.MeshBasicMaterial({ color: frameColor });

  const limiter = useLimiter(20);
  useFrame(({ camera, clock }) => {
    if (!limiter.isReady(clock) || !ref.current) return;

    if (circleRef.current) {
      circleRef.current.scale.setScalar(1 / ref.current.scale.x);
    }

    ref.current.getWorldPosition(dummy);
    const dist = Math.max(dummy.distanceTo(camera.position), 0.25);

    if (dist < RADIUS) setVisible(true);
    else setVisible(false);
  });

  if (!IS_VIDEO && !IS_IMAGE) {
    console.error(
      "Framed Media :: Invalid source url, must be .mp4, .jpg, .jpeg, or .png"
    );
    return null;
  }

  return (
    <group name="proximity-media" ref={ref} {...rest}>
      <animated.group scale={scale}>
        {IS_VIDEO && (
          <Video src={media} framed={framed} frameMaterial={frameMat} />
        )}
        {IS_IMAGE && (
          <Image src={media} framed={framed} frameMaterial={frameMat} />
        )}
      </animated.group>
      {displayRadius && (
        <mesh rotation-x={Math.PI} ref={circleRef}>
          <sphereBufferGeometry args={[RADIUS, 20, 20]} />
          <meshBasicMaterial color="red" wireframe transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
