import { Text } from "@react-three/drei";
import { ComponentProps, useCallback, useState } from "react";
import NumberInput from "../components/NumberInput";
import Button from "./Button";

type TextStyles = Partial<ComponentProps<typeof Text>>;

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type Props = {
  min: number;
  max: number;
  initialValue: number;
  // callback for when user changes value
  onChange: (value: number) => void;
  // callback for when user hits proceed button
  onProceed: () => void;
  // callback for when user hits back
  onBack: () => void;
  textStyles?: TextStyles;
};

const QuantitySelector = (props: Props): JSX.Element => {
  const {
    min,
    max,
    initialValue,
    onChange,
    onProceed,
    onBack,
    textStyles,
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue.toString());
  const [error, setError] = useState<string>();
  const setValueWithCallback = useCallback(
    (value: string) => {
      setValue(value);
      const asInt = parseInt(value);
      if (!isNaN(asInt) && asInt >= min && asInt <= max) {
        setError(undefined);
        onChange(asInt);
      } else {
        setError(`Must be between ${min} and ${max}.`);
      }
    },
    [min, max, onChange]
  );
  const headerTextStyles: TextStyles = {
    font: FONT_FILE,
    color: "black",
    fontSize: 0.06,
    ...textStyles,
  };
  const errorTextStyles: TextStyles = {
    ...headerTextStyles,
    color: "red",
    fontSize: 0.02,
  };

  const onClick = () => {
    if (error) {
      return;
    }

    onProceed();
  };

  return (
    <group name="quantity-selector" {...rest}>
      <group name="header">
        {/* @ts-ignore */}
        <Text {...headerTextStyles} position-y={0.04}>
          How many?
        </Text>
      </group>
      {error ? (
        <>
          {/* @ts-ignore */}
          <Text {...errorTextStyles} position-x={-0.07} position-y={-0.1}>
            {error}
          </Text>
        </>
      ) : null}
      <group name="selector" position-x={-0.07} position-y={-0.04}>
        <NumberInput value={value.toString()} setValue={setValueWithCallback} />
      </group>
      <Button
        onClick={onClick}
        size={1}
        width={1}
        position-x={0.18}
        position-y={-0.04}
        textStyles={headerTextStyles}
      >
        Buy
      </Button>
      <Button
        onClick={onBack}
        size={0.5}
        width={0.5}
        position-x={-0.25}
        position-y={0.09}
        color="gray"
      >
        {"<"}
      </Button>
    </group>
  );
};

export default QuantitySelector;
