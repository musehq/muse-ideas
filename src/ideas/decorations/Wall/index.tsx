import { Suspense, useEffect, useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import Collidable from "./modifier/Collidable";
import { RepeatWrapping, Vector2 } from "three";
import { animated, useSpring } from "react-spring/three";

export type WallProps = {
  texture?: string;
  tiled?: boolean;
  tileSize?: number;
  height?: number;
  width?: number;
} & GroupProps;

function UnSuspensedTextureWall(props: WallProps) {
  const {
    texture = "https://d27rt3a60hh1lx.cloudfront.net/content/musehq/grey_plaster_02_diff_1k.jpg",
    tiled = true,
    tileSize = 1,
    height = 1,
    width = 1,
    ...rest
  } = props;

  const { w, h } = useSpring({
    w: width,
    h: height,
  });

  const texCopy = useTexture(texture);
  const tex = useMemo(() => texCopy.clone(), [texCopy]);

  // initial set up
  tex.offset.set(0, 0);
  tex.wrapS = tex.wrapT = RepeatWrapping;

  const imgWidth = useMemo(() => tex.image.width, [tex]);
  const imgHeight = useMemo(() => tex.image.height, [tex]);

  const max = Math.max(imgWidth, imgHeight);
  const adjWidth = (imgWidth / max) * tileSize,
    adjHeight = (imgHeight / max) * tileSize;

  const calcTiling = (_imgDimension: number, _boxDimension: number) => {
    return _imgDimension / _boxDimension;
  };

  // update repeat of texture
  useEffect(() => {
    if (tiled) {
      tex.repeat = new Vector2(
        calcTiling(width, adjWidth),
        calcTiling(height, adjHeight)
      );
    } else {
      tex.repeat.set(1, 1);
    }

    tex.needsUpdate = true;
  }, [tiled, imgWidth, imgHeight, width, height, adjWidth, adjHeight, tex]);

  return (
    <animated.mesh scale-x={w} scale-y={h}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial map={tex} />
    </animated.mesh>
  );
}

export default function TextureWall(props: WallProps) {
  const {
    texture = "https://d27rt3a60hh1lx.cloudfront.net/content/musehq/grey_plaster_02_diff_1k.jpg",
    tiled = true,
    tileSize = 1,
    height = 1,
    width = 1,
    ...rest
  } = props;

  return (
    <group name="wall" {...rest} scale={1}>
      <Collidable enabled width={width} height={height} depth={0.1}>
        <Suspense fallback={null}>
          <UnSuspensedTextureWall {...props} />
        </Suspense>
      </Collidable>
    </group>
  );
}
