import { Suspense, useCallback, useEffect, useState } from "react";
import { Interactable } from "spacesvr";
import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { DoubleSide } from "three";

interface formats {
  [key: string]: {
    [key: string]: number;
  };
}

type ZestyBannerProps = {
  network?: string; // Polygon, Rinkeby
  space?: string;
  format?: string; // Tall, Wide, Square .. case insensitive
  style?: string; // Standard, Minimal, Transparent
  disableBeacon?: boolean;
} & GroupProps;

export default function ZestyBanner(props: ZestyBannerProps) {
  const {
    network,
    space,
    format,
    style,
    disableBeacon = false,
    ...rest
  } = props;

  const formats: formats = {
    tall: {
      width: 0.75,
      height: 1,
    },
    wide: {
      width: 1,
      height: 0.25,
    },
    square: {
      width: 1,
      height: 1,
    },
  };

  // compiled values to be used below
  const size = formats[(format || "").toLowerCase()];
  const baseUrl = `https://forward.zesty.market/${network?.toLowerCase()}/space/${space?.toLowerCase()}`;
  const hasBeacon = disableBeacon ? "?beacon=0" : "?beacon=1";
  const imageUrl = `${baseUrl}/image/${format?.toLowerCase()}/${style?.toLowerCase()}${hasBeacon}`;
  const onClick = useCallback(() => {
    window.open(`${baseUrl}/cta${hasBeacon}`, "_blank");
  }, [baseUrl, hasBeacon]);

  // check to make sure image is valid before rendering below
  // proper way would be to use an error boundary as useTexture throws an error that needs to be handled
  // but this is simple enough
  const [valid, setValid] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState<string>();
  useEffect(() => {
    const checkUrl = async () => {
      const res = await fetch(imageUrl);
      setValid(res.ok);
      setCheckedUrl(imageUrl);
    };

    if (checkedUrl !== imageUrl) checkUrl();
  }, [checkedUrl, imageUrl]);

  if (
    !formats[format || ""] ||
    !network ||
    !space ||
    !style ||
    !valid ||
    checkedUrl !== imageUrl
  ) {
    return (
      <group name="zesty-banner" {...rest}>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="black" side={DoubleSide} />
        </mesh>
      </group>
    );
  }

  return (
    <group name="zesty-banner" {...rest}>
      <Suspense fallback={null}>
        <ZestyMedia imageUrl={imageUrl} onClick={onClick} size={size} />
      </Suspense>
    </group>
  );
}

type ProtectedZestyMediaProps = {
  imageUrl: string;
  onClick: () => void;
  size: { [key: string]: number };
};

function ZestyMedia(props: ProtectedZestyMediaProps) {
  const { imageUrl, onClick, size } = props;

  const image = useTexture(imageUrl);

  return (
    <Interactable onClick={onClick}>
      <mesh>
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial map={image} transparent side={DoubleSide} />
      </mesh>
    </Interactable>
  );
}
