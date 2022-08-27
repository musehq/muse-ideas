import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import {
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Image } from "spacesvr";
import { Group } from "three";

type TextStyles = Partial<ComponentProps<typeof Text>>;

const ETH_IMG = "https://d27rt3a60hh1lx.cloudfront.net/images/ethereum.png";
const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Poppins-Medium.ttf";

type EthPriceProps = {
  amount: number;
  hideUsd?: boolean;
  textStyles?: TextStyles;
} & GroupProps;

/**
 * Displays the passed eth amount with proper formatting and usd conversion underneath
 *
 * @param props
 * @constructor
 */
export default function EthPrice(props: EthPriceProps) {
  const { amount, hideUsd = false, textStyles: addedStyles, ...rest } = props;

  // configuration
  const IMG_SIZE_MOD = 0.9;
  const ETH_FONT_SIZE_DEFAULT = 0.06;
  const USD_FONT_SIZE_MOD = 0.425;

  // local state
  const textRef = useRef<any>();
  const textGroup = useRef<Group>(null);
  const imgGroup = useRef<Group>(null);
  const [usdPrice, setUsdPrice] = useState<number>();

  // text styles
  const ethTextStyles: TextStyles = {
    font: FONT_FILE,
    color: "black",
    fontSize: ETH_FONT_SIZE_DEFAULT,
    ...addedStyles,
    position: [0, 0, 0],
  };
  const usdTextStyles: TextStyles = {
    ...ethTextStyles,
    color: "#444",
    fontSize:
      (ethTextStyles.fontSize || ETH_FONT_SIZE_DEFAULT) * USD_FONT_SIZE_MOD,
  };

  // calculated values
  const ETH_FONT_SIZE = ethTextStyles.fontSize || ETH_FONT_SIZE_DEFAULT;
  const USD_FONT_SIZE =
    usdTextStyles.fontSize || ETH_FONT_SIZE * USD_FONT_SIZE_MOD;
  const IMG_SIZE = ETH_FONT_SIZE * IMG_SIZE_MOD;
  const USD_TEXT_Y_OFFSET =
    -ETH_FONT_SIZE / 2 - USD_FONT_SIZE / 2 - USD_FONT_SIZE * 0.4;

  // offset text to fit eth logo
  useLayoutEffect(() => {
    if (!textRef.current) return;

    const _text = textRef.current;
    _text.text = formatEth(amount);
    _text.sync(() => {
      if (!textGroup.current || !imgGroup.current) return;

      const bounds = _text._textRenderInfo.blockBounds;

      const textWidth = bounds[2] - bounds[0];
      const anchorX = _text._textRenderInfo.parameters.anchorX;

      const centered = anchorX === "center";

      const imgWidth = IMG_SIZE * 0.7;

      const textOffset = centered ? imgWidth / 2 : imgWidth;
      const imgOffset = centered ? -textWidth / 2 - imgWidth / 2 : 0;

      textGroup.current.position.x = textOffset;
      imgGroup.current.position.x = imgOffset;

      _text.sync();
    });
  }, [addedStyles, amount, IMG_SIZE]);

  // fetch the conversion price of eth to usd and set local usd price
  useEffect(() => {
    const fetchPrice = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      if (!res.ok) return;
      const json = await res.json();
      const ethToUsd = json.ethereum.usd as number;
      setUsdPrice(ethToUsd * amount);
    };

    if (!hideUsd) fetchPrice();
  }, [amount, hideUsd]);

  return (
    <group name="eth-price" {...rest}>
      <group name="eth-text-group" ref={textGroup}>
        {/* @ts-ignore */}
        <Text {...ethTextStyles} ref={textRef}>
          {""}
        </Text>
      </group>
      <group name="image-group" ref={imgGroup}>
        <Image src={ETH_IMG} size={IMG_SIZE} />
      </group>
      <group name="usd-text-group" position-y={USD_TEXT_Y_OFFSET}>
        {usdPrice && !hideUsd && (
          <>
            {/* @ts-ignore */}
            <Text {...usdTextStyles}>(${formatUsd(usdPrice)})</Text>
          </>
        )}
      </group>
    </group>
  );
}

// keep decimals intact, add commas to whole value
const formatEth = (amount: number) => {
  const formatted = amount.toString();
  const [whole, dec] = formatted.split(".");
  // if no dec, don't worry about decimal point
  if (!dec) return numberWithCommas(whole);
  return `${numberWithCommas(whole)}.${dec}`;
};

// format number to usd
const formatUsd = (amount: number) => numberWithCommas(amount.toFixed(2));

// place commas in number string
const numberWithCommas = (x: string) => x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
