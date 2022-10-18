import { Image, useLimiter, Video } from "spacesvr";
import * as THREE from "three";
import { Group, Mesh, Vector3 } from "three";
import { useMemo, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { GroupProps, useFrame } from "@react-three/fiber";

export type ProximityLinkProps = {
  url?: string;
  framed?: boolean;
  frameColor?: string;
  radius?: number;
  media?: string;
  active?: boolean;
} & GroupProps;

export default function ProximityLink(props: ProximityLinkProps) {
  const {
    url = "https://muse.place",
    framed = false,
    frameColor = "#111111",
    radius = 2,
    active = false,
    media = "https://d27rt3a60hh1lx.cloudfront.net/images/turtle.jpg",
    ...rest
  } = props;

  const RADIUS = Math.max(radius, 0.5);

  const ref = useRef<Group>(null);
  const circleRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(true);
  const { scale } = useSpring({ scale: visible ? 1 : 0 });
  const dummy = useMemo(() => new Vector3(), []);
  const [enterToggle, setEnterToggle] = useState(true);

  const modUrl = media.toLowerCase();
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

    if (dist <= RADIUS && active && enterToggle) {
      console.log("______ NEW ENTRY ______");
      console.log("Dist: " + dist + "  Radius: " + RADIUS);
      console.log("Set toggle to false");
      setEnterToggle(false);

      window.alert("OPEN URL");
      // window.open(url, "_self");
    }
    if (dist >= RADIUS) {
      setEnterToggle(true);
    }
  });

  if (!IS_IMAGE) {
    console.error(
      "Framed Media :: Invalid source url, must be .mp4, .jpg, .jpeg, or .png"
    );
    return null;
  }

  return (
    <group name="proximity-media" ref={ref} {...rest}>
      <animated.group>
        {IS_IMAGE && (
          <Image
            src={media}
            framed={framed}
            frameMaterial={frameMat}
            transparent={modUrl.endsWith(".png") || modUrl.endsWith(".PNG")}
          />
        )}
      </animated.group>
    </group>
  );
}
